import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { first } from 'rxjs'
import { EditDialogComponent } from 'src/app/components/common/edit-dialog/edit-dialog.component'
import { group } from 'src/app/data/group'
import { User } from 'src/app/data/user'
import { groupService } from 'src/app/services/rest/group.service'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'

@Component({
  selector: 'pngx-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss'],
})
export class UserEditDialogComponent
  extends EditDialogComponent<User>
  implements OnInit
{
  getActionupdate() {
    return 'update_user'
  }
  getAction() {
    return 'Registration'
  }
  groups: group[]
  passwordIsSet: boolean = false

  constructor(
    service: UserService,
    activeModal: NgbActiveModal,
    groupsService: groupService,
    
    settingsService: SettingsService
  ) {
    super(service, activeModal, service, settingsService)

     groupsService
      .listAllCustom("list_groups")
      .pipe(first())
      .subscribe((result) => (this.groups = result.results)) 
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.onToggleSuperUser()
  }

  getCreateTitle() {
    return $localize`Create new user account`
  }

  getEditTitle() {
    return $localize`Edit user account`
  }

  getForm(): FormGroup {
    return new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      passwordHash: new FormControl(null),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      is_active: new FormControl(true),
      is_superuser: new FormControl(false),
     
      groups: new FormControl([]),
      user_permissions: new FormControl([]),
    })
  }

  onToggleSuperUser() {
    if (this.objectForm.get('is_superuser').value) {
      this.objectForm.get('user_permissions').disable()
    } else {
      this.objectForm.get('user_permissions').enable()
    }
  }

  get inheritedPermissions(): string[] {
    const groupsVal: Array<string> = this.objectForm.get('groups').value

    if (!groupsVal) return []
    else
      return groupsVal.flatMap(
        (id) => this.groups.find((g) => g.id == id)?.permissions
      )
  }

  save(): void {
    this.passwordIsSet =
      this.objectForm.get('passwordHash').value?.toString().replaceAll('*', '')
        .length > 0
        console.log(this.objectForm.value);
    super.save()
  }
}
