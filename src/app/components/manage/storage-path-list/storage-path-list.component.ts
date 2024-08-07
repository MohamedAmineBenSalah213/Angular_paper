import { Component } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FILTER_HAS_STORAGE_PATH_ANY } from 'src/app/data/filter-rule-type'
import { storagePath } from 'src/app/data/storage-path'
import { DocumentListViewService } from 'src/app/services/document-list-view.service'
import {
  PermissionsService,
  PermissionType,
} from 'src/app/services/permissions.service'
import { StoragePathService } from 'src/app/services/rest/storage-path.service'
import { ToastService } from 'src/app/services/toast.service'
import { StoragePathEditDialogComponent } from '../../common/edit-dialog/storage-path-edit-dialog/storage-path-edit-dialog.component'
import { ManagementListComponent } from '../management-list/management-list.component'
import { OidcSecurityService } from 'angular-auth-oidc-client'

@Component({
  selector: 'pngx-storage-path-list',
  templateUrl: './../management-list/management-list.component.html',
  styleUrls: ['./../management-list/management-list.component.scss'],
})
export class StoragePathListComponent extends ManagementListComponent<storagePath> {
  constructor(
    directoryService: StoragePathService,
    modalService: NgbModal,
    toastService: ToastService,
    documentListViewService: DocumentListViewService,
    permissionsService: PermissionsService,
    oidcSecurityService : OidcSecurityService
  ) {
    super(
      directoryService,
      modalService,
      StoragePathEditDialogComponent,
      toastService,
      documentListViewService,
      permissionsService,
      oidcSecurityService,
      FILTER_HAS_STORAGE_PATH_ANY,
      $localize`storage path`,
      $localize`storage paths`,
      PermissionType.StoragePath,
      'list_storage_paths',
      [
        {
          key: 'path',
          name: $localize`Path`,
          valueFn: (c: storagePath) => {
            return c.path
          },
        },
      ]
    )
  }

  getDeleteMessage(object: storagePath) {
    return $localize`Do you really want to delete the storage path "${object.name}"?`
  }
  getAction(){
    return 'delete_storage_path';
  }
}
