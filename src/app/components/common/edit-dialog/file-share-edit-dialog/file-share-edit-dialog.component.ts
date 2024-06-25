import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/rest/user.service';
import { SettingsService } from 'src/app/services/settings.service';
import { EditDialogComponent } from '../edit-dialog.component';
import { FileShare } from 'src/app/data/file-share';
import { FileShareService } from 'src/app/services/rest/file-share.service';
import { MsalService } from '@azure/msal-angular';


@Component({
  selector: 'pngx-file-share-edit-dialog',
  templateUrl: './file-share-edit-dialog.component.html',
  styleUrls: ['./file-share-edit-dialog.component.scss']
})
export class FileShareEditDialogComponent extends EditDialogComponent<FileShare> {
  constructor(
    service: FileShareService ,
   activeModal: NgbActiveModal,
    userService: UserService,
    settingsService: SettingsService,
    msalService:MsalService
  ) {
    super(service, activeModal, userService, settingsService,msalService);
  }

  getCreateTitle() {
    return $localize`Create new File Share`;
  }

  getEditTitle() {
    return $localize`Edit File Share`;
  }

  getForm(): FormGroup {
    return new FormGroup({
      folderPath: new FormControl(''),
      password: new FormControl(''),
      shareName: new FormControl(''),
      username: new FormControl(''),
    });
  }
  getActionupdate() {
    return 'update_share_file';
  }
  getAction() {
    return 'add_share_file';
  }
}
