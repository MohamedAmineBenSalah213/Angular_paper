import { Component } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { EditDialogComponent } from 'src/app/components/common/edit-dialog/edit-dialog.component'
import { group } from 'src/app/data/group'
import { groupService } from 'src/app/services/rest/group.service'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'

@Component({
  selector: 'pngx-group-edit-dialog',
  templateUrl: './group-edit-dialog.component.html',
  styleUrls: ['./group-edit-dialog.component.scss'],
})
export class GroupEditDialogComponent extends EditDialogComponent<group> {
  getActionupdate() {
    return "update_group";
  }
  getAction() {
    return "add_group";
  }
  constructor(
    service: groupService,
    activeModal: NgbActiveModal,
    userService: UserService,
    settingsService: SettingsService
  ) {
    super(service, activeModal, userService, settingsService)
  }

  getCreateTitle() {
    return $localize`Create new user group`
  }

  getEditTitle() {
    return $localize`Edit user group`
  }

  getForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      permissions: new FormControl(null),
    })
  }
}
