import { SettingsService } from './services/settings.service'
import { SETTINGS_KEYS } from './data/paperless-uisettings'
import { Component, Inject, OnDestroy, OnInit, Renderer2, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, Subscription, filter, first, takeUntil } from 'rxjs'
import { ConsumerStatusService } from './services/consumer-status.service'
import { ToastService } from './services/toast.service'
import { TasksService } from './services/tasks.service'
import { TourService } from 'ngx-ui-tour-ng-bootstrap'
import {
  PermissionAction,
  PermissionsService,
  PermissionType,
} from './services/permissions.service'
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular'
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser'
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client'
import { AzureAdDemoService } from './azure-ad-demo.service'
import { Claim } from './components/admin/login/login.component'

@Component({
  selector: 'pngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  newDocumentSubscription: Subscription
  successSubscription: Subscription
  failedSubscription: Subscription
  loginDisplay = false;
  private readonly _destroy=new Subject<void>();
 // isIframe = false;
  private readonly oidcSecurityService = inject(OidcSecurityService);
  dataSource: Claim[] = [];
  constructor(
    private settings: SettingsService,
    private consumerStatusService: ConsumerStatusService,
    private toastService: ToastService,
    private router: Router,
    private tasksService: TasksService,
    public tourService: TourService,
    private renderer: Renderer2,
    private permissionsService: PermissionsService,  @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration,
    private msalService:MsalService,
    private _activatedRoute :ActivatedRoute,
    private msalBroadCastService:MsalBroadcastService,
    private azureAdDemoService:AzureAdDemoService,
      public settingsService: SettingsService,
  //  private _activatedRoute :ActivatedRoute

  ) {
    let anyWindow = window as any
    anyWindow.pdfWorkerSrc = 'assets/js/pdf.worker.min.js'
    this.settings.updateAppearanceSettings()

  }

  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
    this.consumerStatusService.disconnect()
    if (this.successSubscription) {
      this.successSubscription.unsubscribe()
    }
    if (this.failedSubscription) {
      this.failedSubscription.unsubscribe()
    }
    if (this.newDocumentSubscription) {
      this.newDocumentSubscription.unsubscribe()
    }
  }

  private showNotification(key) {
    if (
      this.router.url == '/dashboard' &&
      this.settings.get(
        SETTINGS_KEYS.NOTIFICATIONS_CONSUMER_SUPPRESS_ON_DASHBOARD
      )
    ) {
      return false
    }
    return this.settings.get(key)
  }
  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }
  checkAndSetActiveAccount() {

    let activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      
      let accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
      // this.settingsService.initializeSettings().subscribe((uisettings)=>{
      //   this.permissionsService.initialize(
      //     uisettings.permissions,
      //     uisettings.user
      //   );
      
      //   console.log("settings");
      //   this.permissionsService.currentUserCan(
      //     PermissionAction.View,
      //     PermissionType.SavedView
      //   )
        
      // })
    }
  }

  getClaims(claims: any) {

    let list: Claim[]  =  new Array<Claim>();

    Object.keys(claims).forEach(function(k, v){
      
      let c = new Claim()
      c.id = v;
      c.claim = k;
      c.value =  claims ? claims[k]: null;
      list.push(c);
    });
    this.dataSource = list;

  }
  handleAuthResponse() {
    this.msalService.handleRedirectObservable().subscribe({
      next: (response: AuthenticationResult) => {
        if (response.accessToken) {
          const accessToken = response.accessToken;
          // Store access token in localStorage
          localStorage.setItem('accessToken', accessToken);
        }
      },
      error: (error) => {
        console.error('Redirect error:', error);
      }
    });
  }
  ngOnInit(): void {
    
    // this.oidcSecurityService
    // .checkAuth()
    // .subscribe((loginResponse: LoginResponse) => {
    //   const { isAuthenticated, userData, accessToken, idToken, configId } =
    //     loginResponse;
    //     console.log(loginResponse+"App")
    //     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
    //     console.log("redirectURL",redirectURL)
    //     // // Navigate to the redirect url
    //      this.router.navigateByUrl(redirectURL);
    //    //  window.location.replace(redirectURL)

    //   /*...*/
    // });
   // this.isIframe = window !== window.parent && !window.opener;
// this.isIframe = window !== window.parent && !window.opener;
    this.msalBroadCastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) =>  status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
      takeUntil(this._destroy)
    )
    .subscribe(() => {

      this.checkAndSetActiveAccount();
      this.setLoginDisplay();
      this.azureAdDemoService.isUserLoggedInAzureDemo.next(this.loginDisplay)
     // this.handleAuthResponse();
    //  this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims)
    })
   
    // this.settingsService.initializeSettings().subscribe(
    //   (settings) => {
    //     console.log('Settings initialized:', settings);
    //   },
    //   (error) => {
    //     console.error('Error initializing settings:', error);
    //   }
    //);
  //  if(this.loginDisplay){
  //    this.router.navigate(['/dashboard']);
  //  }
    this.consumerStatusService.connect()

    this.successSubscription = this.consumerStatusService
      .onDocumentConsumptionFinished()
      .subscribe((status) => {
        this.tasksService.reload()
        if (
          this.showNotification(SETTINGS_KEYS.NOTIFICATIONS_CONSUMER_SUCCESS)
        ) {
          if (
            this.permissionsService.currentUserCan(
              PermissionAction.View,
              PermissionType.Document
            )
          ) {
            this.toastService.show({
              content: $localize`Document ${status.filename} was added to Digital Work.`,
              delay: 10000,
              actionName: $localize`Open document`,
              action: () => {
                this.router.navigate(['documents', status.documentId])
              },
            })
          } else {
            this.toastService.show({
              content: $localize`Document ${status.filename} was added to Digital Work.`,
              delay: 10000,
            })
          }
        }
      })

    this.failedSubscription = this.consumerStatusService
      .onDocumentConsumptionFailed()
      .subscribe((status) => {
        this.tasksService.reload()
        if (
          this.showNotification(SETTINGS_KEYS.NOTIFICATIONS_CONSUMER_FAILED)
        ) {
          this.toastService.showError(
            $localize`Could not add ${status.filename}\: ${status.message}`
          )
        }
      })

    this.newDocumentSubscription = this.consumerStatusService
      .onDocumentDetected()
      .subscribe((status) => {
        this.tasksService.reload()
        if (
          this.showNotification(
            SETTINGS_KEYS.NOTIFICATIONS_CONSUMER_NEW_DOCUMENT
          )
        ) {
          this.toastService.show({
            content: $localize`Document ${status.filename} is being processed by Digital Work.`,
            delay: 5000,
          })
        }
      })

    const prevBtnTitle = $localize`Prev`
    const nextBtnTitle = $localize`Next`
    const endBtnTitle = $localize`End`

    this.tourService.initialize(
      [
        {
          anchorId: 'tour.dashboard',
          content: $localize`The dashboard can be used to show saved views, such as an 'Inbox'. Those settings are found under Settings > Saved Views once you have created some.`,
          route: '/dashboard',
          delayAfterNavigation: 500,
          isOptional: false,
        },
        {
          anchorId: 'tour.upload-widget',
          content: $localize`Drag-and-drop documents here to start uploading or place them in the consume folder. You can also drag-and-drop documents anywhere on all other pages of the web app. Once you do, Digital Work will start training its machine learning algorithms.`,
          route: '/dashboard',
        },
        {
          anchorId: 'tour.documents',
          content: $localize`The documents list shows all of your documents and allows for filtering as well as bulk-editing. There are three different view styles: list, small cards and large cards. A list of documents currently opened for editing is shown in the sidebar.`,
          route: '/documents?sort=created&reverse=1&page=1',
          delayAfterNavigation: 500,
          placement: 'bottom',
        },
        {
          anchorId: 'tour.documents-filter-editor',
          content: $localize`The filtering tools allow you to quickly find documents using various searches, dates, tags, etc.`,
          route: '/documents?sort=created&reverse=1&page=1',
          placement: 'bottom',
        },
        {
          anchorId: 'tour.documents-views',
          content: $localize`Any combination of filters can be saved as a 'view' which can then be displayed on the dashboard and / or sidebar.`,
          route: '/documents?sort=created&reverse=1&page=1',
        },
        {
          anchorId: 'tour.tags',
          content: $localize`Tags, correspondents, document types and storage paths can all be managed using these pages. They can also be created from the document edit view.`,
          route: '/tags',
          backdropConfig: {
            offset: 0,
          },
        },
        {
          anchorId: 'tour.mail',
          content: $localize`Manage e-mail accounts and rules for automatically importing documents.`,
          route: '/mail',
          backdropConfig: {
            offset: 0,
          },
        },
        {
          anchorId: 'tour.consumption-templates',
          content: $localize`Consumption templates give you finer control over the document ingestion process.`,
          route: '/templates',
          backdropConfig: {
            offset: 0,
          },
        },
        {
          anchorId: 'tour.file-tasks',
          content: $localize`File Tasks shows you documents that have been consumed, are waiting to be, or may have failed during the process.`,
          route: '/tasks',
          backdropConfig: {
            offset: 0,
          },
        },
        {
          anchorId: 'tour.settings',
          content: $localize`Check out the settings for various tweaks to the web app and toggle settings for saved views.`,
          route: '/settings',
          backdropConfig: {
            offset: 0,
          },
        },
        {
          anchorId: 'tour.outro',
          title: $localize`Thank you! 🙏`,
          content:
            $localize`There are <em>tons</em> more features and info we didn't cover here, but this should get you started. Check out the documentation or visit the project on GitHub to learn more or to report issues.` +
            '<br/><br/>' +
            $localize`Lastly, on behalf of every contributor to this community-supported project, thank you for using Digital Work!`,
          route: '/dashboard',
          isOptional: false,
          backdropConfig: {
            offset: 0,
          },
        },
      ],
      {
        enableBackdrop: true,
        backdropConfig: {
          offset: 10,
        },
        prevBtnTitle,
        nextBtnTitle,
        endBtnTitle,
        isOptional: true,
        useLegacyTitle: true,
      }
    )

    this.tourService.start$.subscribe(() => {
      this.renderer.addClass(document.body, 'tour-active')

      this.tourService.end$.pipe(first()).subscribe(() => {
        this.settings.completeTour()
        // animation time
        setTimeout(() => {
          this.renderer.removeClass(document.body, 'tour-active')
        }, 500)
      })
    })
  }
}
