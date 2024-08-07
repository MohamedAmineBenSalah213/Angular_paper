import { Component } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { first } from 'rxjs'
import {
  DocumentSource,
  consumptionTemplate,
  WorkflowTriggerType,
} from 'src/app/data/consumption-template'
import { correspondent } from 'src/app/data/correspondent'
import { documentType } from 'src/app/data/document-type'
import { storagePath } from 'src/app/data/storage-path'
import { ConsumptionTemplateService } from 'src/app/services/rest/consumption-template.service'
import { CorrespondentService } from 'src/app/services/rest/correspondent.service'
import { DocumentTypeService } from 'src/app/services/rest/document-type.service'
import { StoragePathService } from 'src/app/services/rest/storage-path.service'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'
import { EditDialogComponent } from '../edit-dialog.component'
import { MailRuleService } from 'src/app/services/rest/mail-rule.service'
import { mailRule } from 'src/app/data/mail-rule'
import { DEFAULT_MATCHING_ALGORITHM, MATCHING_ALGORITHMS, MATCH_AUTO } from 'src/app/data/matching-model'
import { PermissionsService } from 'src/app/services/permissions.service'
export const WORKFLOW_TYPE_OPTIONS = [
  {
    id: WorkflowTriggerType.Consumption,
    name: $localize`Consumption Started`,
  },
  {
    id: WorkflowTriggerType.DocumentAdded,
    name: $localize`Document Added`,
  },
  {
    id: WorkflowTriggerType.DocumentUpdated,
    name: $localize`Document Updated`,
  },
]

export const DOCUMENT_SOURCE_OPTIONS = [
  {
    id: DocumentSource.ConsumeFolder,
    name: $localize`Consume Folder`,
  },
  {
    id: DocumentSource.ApiUpload,
    name: $localize`API Upload`,
  },
  {
    id: DocumentSource.MailFetch,
    name: $localize`Mail Fetch`,
  },
]
const TRIGGER_MATCHING_ALGORITHMS = MATCHING_ALGORITHMS.filter(
  (a) => a.id !== MATCH_AUTO
)
@Component({
  selector: 'pngx-consumption-template-edit-dialog',
  templateUrl: './consumption-template-edit-dialog.component.html',
  styleUrls: ['./consumption-template-edit-dialog.component.scss'],
})
export class ConsumptionTemplateEditDialogComponent extends EditDialogComponent<consumptionTemplate> {
 
  templates: consumptionTemplate[]
  correspondents: correspondent[]
  documentTypes: documentType[]
  storagePaths: storagePath[]
  mailRules: mailRule[]
  public WorkflowTriggerType = WorkflowTriggerType
  constructor(
    service: ConsumptionTemplateService,
    activeModal: NgbActiveModal,
    correspondentService: CorrespondentService,
    documentTypeService: DocumentTypeService,
    storagePathService: StoragePathService,
    mailRuleService: MailRuleService,
    permissionService:PermissionsService,
    userService: UserService,
    settingsService: SettingsService
  ) {
    super(service, activeModal, userService, settingsService)

    correspondentService
    .listAll(null,null,"list_correspondent",permissionService.getCurrentUserID())
      .pipe(first())
      .subscribe((result) => (this.correspondents = result.results))

    documentTypeService
    .listAll(null,null,"list_types_dropdown",permissionService.getCurrentUserID())
      .pipe(first())
      .subscribe((result) => (this.documentTypes = result.results))

    storagePathService
    .listAll(null,null,"list_storage_paths_dropdown",permissionService.getCurrentUserID())
      .pipe(first())
      .subscribe((result) => (this.storagePaths = result.results))

    mailRuleService
    .listAll(null,null,"list_mailrule",null)
      .pipe(first())
      .subscribe((result) => (this.mailRules = result.results))
  }

  getCreateTitle() {
    return $localize`Create new consumption template`
  }

  getEditTitle() {
    return $localize`Edit consumption template`
  }

  getForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(null),
      type: new FormControl(null),
      is_Enabled:new FormControl(false),
      account: new FormControl(null),
      filter_filename: new FormControl(null),
      filter_path: new FormControl(null),
      filter_mailrule: new FormControl(null),
      matching_algorithm: new FormControl(),
      match: new FormControl(''),
      is_insensitive: new FormControl(null),
      filter_has_tags: new FormControl(null),
      filter_has_correspondent: new FormControl(
        null
      ),
      filter_has_document_type: new FormControl(
        null
      ),
      order: new FormControl(null),
      sources: new FormControl([]),
      assign_title: new FormControl(null),
      assign_tags: new FormControl([]),
      assign_owner: new FormControl(null),
      assign_document_type: new FormControl(null),
      assign_correspondent: new FormControl(null),
      assign_storage_path: new FormControl(null),
      assign_view_users: new FormControl([]),
      assign_view_groups: new FormControl([]),
      assign_change_users: new FormControl([]),
      assign_change_groups: new FormControl([]),
      documentClassification: new FormControl(null),
    })
  }
  getMatchingAlgorithms() {
    // No auto matching
    return TRIGGER_MATCHING_ALGORITHMS
  }
  getTriggerTypeOptionName(type: WorkflowTriggerType): string {
    return this.triggerTypeOptions.find((t) => t.id === type)?.name ?? ''
  }
  get sourceOptions() {
    return DOCUMENT_SOURCE_OPTIONS
  }
  get triggerTypeOptions() {
    return WORKFLOW_TYPE_OPTIONS
  }
  getActionupdate() {
    "update_template"
  }
  getAction() {
    "add_template"
  }
}
