import { Component, OnInit } from '@angular/core'
import { ConsumptionTemplateService } from 'src/app/services/rest/consumption-template.service'
import { ComponentWithPermissions } from '../../with-permissions/with-permissions.component'
import { Subject, takeUntil } from 'rxjs'
import { consumptionTemplate, WorkflowTriggerType } from 'src/app/data/consumption-template'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastService } from 'src/app/services/toast.service'
import { PermissionsService } from 'src/app/services/permissions.service'
import {
  ConsumptionTemplateEditDialogComponent,
  DOCUMENT_SOURCE_OPTIONS,
  WORKFLOW_TYPE_OPTIONS,
} from '../../common/edit-dialog/consumption-template-edit-dialog/consumption-template-edit-dialog.component'
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component'
import { EditDialogMode } from '../../common/edit-dialog/edit-dialog.component'

@Component({
  selector: 'pngx-consumption-templates',
  templateUrl: './consumption-templates.component.html',
  styleUrls: ['./consumption-templates.component.scss'],
})
export class ConsumptionTemplatesComponent
  extends ComponentWithPermissions
  implements OnInit
{
  public templates: consumptionTemplate[] = []

  private unsubscribeNotifier: Subject<any> = new Subject()
  id: any

  constructor(
    private consumptionTemplateService: ConsumptionTemplateService,
    public permissionsService: PermissionsService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {
    super()
  }

  ngOnInit() {
    this.reload()
  }

  reload() {
    debugger
     this.id = this.permissionsService.getCurrentUserID();
    
    this.consumptionTemplateService
      .list(null,null,null,null,"list_templates",this.id,null)
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((r) => {
        this.templates = r.results
        console.log(this.templates);
        
      })
  }

  getWorkflowTriggerTypeString(type: WorkflowTriggerType): string {
    switch (type) {
      case WorkflowTriggerType.Consumption:
        return 'Consumption Started';
      case WorkflowTriggerType.DocumentAdded:
        return 'Document Added';
      case WorkflowTriggerType.DocumentUpdated:
        return 'Document Updated';
      default:
        return 'Unknown';
    }
  }
  
  // Function to get the type as string from ConsumptionTemplate
   getSourceList(template: consumptionTemplate): string {
    return this.getWorkflowTriggerTypeString(template.type);
  }
  
  createTemplate() {
   
    const modal = this.modalService.open(
      ConsumptionTemplateEditDialogComponent,
      {
        backdrop: 'static',
        size: 'xl',
      }
    )
    modal.componentInstance.dialogMode =EditDialogMode.CREATE
    modal.componentInstance.succeeded
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((newTemplate) => {
        this.toastService.showInfo(
          $localize`Successfully created template "${newTemplate.name}".`
        )
        this.consumptionTemplateService.clearCache()
        this.reload()
      })
    modal.componentInstance.failed
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((e) => {
        this.toastService.showError($localize`Error saving template.`, e)
      })
  }
  editTemplate(rule: consumptionTemplate) {
    debugger
    const modal = this.modalService.open(
      ConsumptionTemplateEditDialogComponent,
      {
        backdrop: 'static',
        size: 'xl',
      }
    )
    modal.componentInstance.dialogMode = EditDialogMode.EDIT
      
    modal.componentInstance.object = rule
    modal.componentInstance.succeeded
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((newTemplate) => {
        this.toastService.showInfo(
          $localize`Saved template "${newTemplate.name}".`
        )
        this.consumptionTemplateService.clearCache()
        this.reload()
      })
    modal.componentInstance.failed
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((e) => {
        this.toastService.showError($localize`Error saving template.`, e)
      })
  }

  deleteTemplate(rule: consumptionTemplate) {
    const modal = this.modalService.open(ConfirmDialogComponent, {
      backdrop: 'static',
    })
    modal.componentInstance.title = $localize`Confirm delete template`
    modal.componentInstance.messageBold = $localize`This operation will permanently delete this template.`
    modal.componentInstance.message = $localize`This operation cannot be undone.`
    modal.componentInstance.btnClass = 'btn-danger'
    modal.componentInstance.btnCaption = $localize`Proceed`
    modal.componentInstance.confirmClicked.subscribe(() => {
      modal.componentInstance.buttonsEnabled = false
      this.consumptionTemplateService.delete(rule).subscribe({
        next: () => {
          modal.close()
          this.toastService.showInfo($localize`Deleted template`)
          this.consumptionTemplateService.clearCache()
          this.reload()
        },
        error: (e) => {
          this.toastService.showError($localize`Error deleting template.`, e)
        },
      })
    })
  }
}
