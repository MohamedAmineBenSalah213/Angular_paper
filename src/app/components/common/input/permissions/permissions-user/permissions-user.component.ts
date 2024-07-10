import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { first } from 'rxjs/operators'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'
import { AbstractInputComponent } from '../../abstract-input'
import { User } from 'src/app/data/user'

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermissionsUserComponent),
      multi: true,
    },
  ],
  selector: 'pngx-permissions-user',
  templateUrl: './permissions-user.component.html',
  styleUrls: ['./permissions-user.component.scss'],
})
export class PermissionsUserComponent extends AbstractInputComponent<
  User[]
> {
  users: User[]

  constructor(userService: UserService, settings: SettingsService) {
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
}
 /* userService
      .listAllCustom("list_user")
      .pipe(first())
      .subscribe((result) => (this.users = result.results))
  }
  } */