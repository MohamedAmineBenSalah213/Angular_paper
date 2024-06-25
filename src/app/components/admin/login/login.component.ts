import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { Subject, Subscriber, filter, takeUntil } from 'rxjs';
import { AzureAdDemoService } from 'src/app/azure-ad-demo.service';
 
@Component({
  selector: 'pngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  title = '';
  userData$: any;
  isAuthenticated = false;
  user_info: any;
  user_email: any;
  token: any;
  isUserLoggedIn:boolean=false
  titleMsal = 'msal-angular-tutorial';
  isIframe = false;
  loginDisplay = false;
  dataSource: Claim[] = [];
  private readonly _destroy=new Subject<void>();
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration,
    private msalService:MsalService,private _activatedRoute :ActivatedRoute,private msalBroadCastService:MsalBroadcastService
  ) {
    console.log('AppComponent STARTING');
  }
  isLoggedIn():boolean{
    return this.msalService.instance.getActiveAccount()!=null
 }
//  handleAuthResponse() {
//   this.msalService.handleRedirectObservable().subscribe({
//     next: (response: AuthenticationResult) => {
//       console.log("// Check if there's an access token in the response")
//       if (response.accessToken) {
//         const accessToken = response.accessToken;
//         // Store access token in localStorage
//         localStorage.setItem('accessToken', accessToken);
//       }
//     },
//     error: (error) => {
//       console.error('Redirect error:', error);
//     }
//   });
// }
 loginAzure(){
  
  if (this.msalGuardConfig.authRequest){
    this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
  //  console.log(this.msalGuardConfig.authRequest)
    
    console.error('Redirect error:');
 //   this.msalService.instance.setActiveAccount(response.account);
  } else {
    this.msalService.loginRedirect();
    
    console.error('Redirect error:');
  }
    // if (this.msalGuardConfig.authRequest){
    //   this.msalService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
    //     .subscribe({
    //       next: (result) => {
    //         console.log(result);
    //        this.setLoginDisplay();
           
    //       },
    //       error: (error) => console.log(error)
    //     });
    // } else {
    //   this.msalService.loginPopup()
    //     .subscribe({
    //       next: (result) => {
    //         console.log(result+'result');
    //         this.setLoginDisplay();
    //       },
    //       error: (error) => console.log(error)
    //     });
    // }
}

setLoginDisplay() {
  this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
}
 logoutAzure(){
   this.msalService.logoutRedirect({postLogoutRedirectUri:"http://localhost:4200"})
 }
  //  this.msalService.loginPopup().subscribe((response:AuthenticationResult)=>{
  //    this.msalService.instance.setActiveAccount(response.account)
  //  })
    //  if(this.msalGuardConfig.authRequest){
    //   this.msalService.loginRedirect({
    //   ...this.msalGuardConfig.authRequest
    //  }as RedirectRequest) 
    //  console.log("login")
    // }
    //  else{
    //   this.msalService.loginRedirect();
    //  }
   
  ngOnInit(): void {
  
    // this.isIframe = window !== window.parent && !window.opener;
    // this.msalBroadCastService.inProgress$
    // .pipe(
    //   filter((status: InteractionStatus) =>  status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
    //   takeUntil(this._destroy)
    // )
    // .subscribe(() => {
    //   this.checkAndSetActiveAccount();
    //   this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims)
    // })
    // if(this.isLoggedIn){
    //   this.router.navigate(['/dashboard']);
    // }

  
  }
 
  // private decodeToken(token: string): any {
  //   try {
  //     // Use jwt-decode to decode the token
  //     return jwtDecode(token);
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     return null;
  //   }
  // }
 
  login(): void {
    this.oidcSecurityService.authorize();  
  }
 
  forceRefreshSession() {
    this.oidcSecurityService
      .forceRefreshSession()
      .subscribe((result) => console.warn(result));
  }
 
  logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log('okkk', result));
  }
  ngOnDestroy():void{
    this._destroy.next(undefined);
    this._destroy.complete();
  }
}
export class Claim {
  id: number;
  claim: string;
  value: string;
}