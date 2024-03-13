import { Component } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { EditDialogComponent } from 'src/app/components/common/edit-dialog/edit-dialog.component'
import { PaperlessTag } from 'src/app/data/paperless-tag'
import { TagService } from 'src/app/services/rest/tag.service'
import { randomColor } from 'src/app/utils/color'
import { DEFAULT_MATCHING_ALGORITHM } from 'src/app/data/matching-model'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'

@Component({
  selector: 'pngx-tag-edit-dialog',
  templateUrl: './tag-edit-dialog.component.html',
  styleUrls: ['./tag-edit-dialog.component.scss'],
})
export class TagEditDialogComponent extends EditDialogComponent<PaperlessTag> {
  getAction() {
   return "post_tag";
  }
  getActionupdate(){
    return "update_tag";
  }
  constructor(
    service: TagService,
    activeModal: NgbActiveModal,
    userService: UserService,
    settingsService: SettingsService,
    private fb: FormBuilder
  ) {
    super(service, activeModal, userService, settingsService)
  }
 
  getCreateTitle() {
    return $localize`Create new tag`
  }

  getEditTitle() {
    return $localize`Edit tag`
  }
 objectForm: FormGroup; 
  getForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      color: new FormControl(randomColor()),
      is_inbox_tag: new FormControl(false),
      matchalgorithm: new FormControl(DEFAULT_MATCHING_ALGORITHM),
      match: new FormControl(['']),
      is_insensitive: new FormControl(true),
      owner:new FormControl(null),
      DocumentTags:new FormControl(null),
      permissions_form: new FormControl(null),
    })
  }
  
}
