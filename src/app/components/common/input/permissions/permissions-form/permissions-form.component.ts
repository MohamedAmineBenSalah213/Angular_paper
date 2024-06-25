import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms'
import { PaperlessUser } from 'src/app/data/paperless-user'
import { AbstractInputComponent } from '../../abstract-input'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { MsalService } from '@azure/msal-angular'
import { UserService } from 'src/app/services/rest/user.service'
import { first } from 'rxjs'

export interface PermissionsFormObject {
  owner?: string
  set_permissions?: {
    view?: UserGroupPermission;
    change?: UserGroupPermission;
  }
}
export interface UserGroupPermission {
  users?: string[];
  groups?: string[];
}
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermissionsFormComponent),
      multi: true,
    },
  ],
  selector: 'pngx-permissions-form',
  templateUrl: './permissions-form.component.html',
  styleUrls: ['./permissions-form.component.scss'],
})
export class PermissionsFormComponent
  extends AbstractInputComponent<PermissionsFormObject>
  implements OnInit
{
  @Input()
  users: PaperlessUser[]
  username: string;
  @Input()
  accordion: boolean = false
  
  form = new FormGroup({
    owner: new FormControl(null),
    set_permissions: new FormGroup({
      view: new FormGroup({
        users: new FormControl([]),
        groups: new FormControl([]),
      }),
      change: new FormGroup({
        users: new FormControl([]),
        groups: new FormControl([]),
      }),
    }),
  })
 
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private msalService:MsalService,
    userService: UserService,
  ) {
    super()
    userService
  .listAllCustom("list_user")
  .pipe(first())
  .subscribe({
    next: (r) => {
      //debugger
      this.users = r.results
      console.log(this.users.forEach(e=> console.log(
       e)));
      
    },
    error: (e) => {
     console.log(e);
     
    },
  })
  }

  ngOnInit(): void {
   
    const activeAccount = this.msalService.instance.getActiveAccount();
    this.username=activeAccount.username;
    this.form.get('owner').setValue(this.username);
    const userData =this.form.get('set_permissions').value;

  //   console.log(this.form+"form")
  //  const transformedUsersView = userData.view.users.map(user => user.id);
  //   this.form.get('set_permissions.view.users').setValue(transformedUsersView);

     // Log the form value to verify it's set correctly

    this.form.valueChanges.subscribe((value) => {
      // console.log(this.form.value,transformedUsersView);
      console.log(value);
      this.onChange(value);
    });
   
    
    
  }

  writeValue(newValue: any): void {
   // debugger
    this.form.patchValue(newValue, { emitEvent: false })
  }

 
}
