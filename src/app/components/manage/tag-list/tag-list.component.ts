import { Component } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FILTER_HAS_TAGS_ALL } from 'src/app/data/filter-rule-type'
import { tag } from 'src/app/data/tag'
import { DocumentListViewService } from 'src/app/services/document-list-view.service'
import {
  PermissionsService,
  PermissionType,
} from 'src/app/services/permissions.service'
import { TagService } from 'src/app/services/rest/tag.service'
import { ToastService } from 'src/app/services/toast.service'
import { TagEditDialogComponent } from '../../common/edit-dialog/tag-edit-dialog/tag-edit-dialog.component'
import { ManagementListComponent } from '../management-list/management-list.component'
import { OidcSecurityService } from 'angular-auth-oidc-client'

@Component({
  selector: 'pngx-tag-list',
  templateUrl: './../management-list/management-list.component.html',
  styleUrls: ['./../management-list/management-list.component.scss'],
})
export class TagListComponent extends ManagementListComponent<tag> {
  getAction() {
    return "delete_tag";
  }
  constructor(
    tagService: TagService,
    modalService: NgbModal,
    toastService: ToastService,
    documentListViewService: DocumentListViewService,
    permissionsService: PermissionsService,
    oidcSecurityService :OidcSecurityService
  ) {
    super(
      tagService,
      modalService,
      TagEditDialogComponent,
      toastService,
      documentListViewService,
      permissionsService,
      oidcSecurityService,
      FILTER_HAS_TAGS_ALL,
      $localize`tag`,
      $localize`tags`,
      PermissionType.Tag,
      "list_tags",
      [
        {
          key: 'color',
          name: $localize`Color`,
          rendersHtml: true,
          valueFn: (t: tag) => {
            return `<span class="badge" style="color: ${t.text_color}; background-color: ${t.color}">${t.color}</span>`
          },
        },
      ]
    )
  }

  getDeleteMessage(object: tag) {
    return $localize`Do you really want to delete the tag "${object.name}"?`
  }
  
}
