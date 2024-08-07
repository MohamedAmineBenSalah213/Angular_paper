import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core'
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Subject, first, takeUntil } from 'rxjs'
import { customField } from 'src/app/data/custom-field'
import { CustomFieldInstance } from 'src/app/data/custom-field-instance'
import { CustomFieldsService } from 'src/app/services/rest/custom-fields.service'
import { ToastService } from 'src/app/services/toast.service'
import { CustomFieldEditDialogComponent } from '../edit-dialog/custom-field-edit-dialog/custom-field-edit-dialog.component'
import {
  PermissionAction,
  PermissionType,
  PermissionsService,
} from 'src/app/services/permissions.service'

@Component({
  selector: 'pngx-custom-fields-dropdown',
  templateUrl: './custom-fields-dropdown.component.html',
  styleUrls: ['./custom-fields-dropdown.component.scss'],
})
export class CustomFieldsDropdownComponent implements OnDestroy {
  @Input()
  documentId: number

  @Input()
  disabled: boolean = false

  @Input()
  existingFields: CustomFieldInstance[] = []

  @Output()
  added: EventEmitter<customField> = new EventEmitter()

  @Output()
  created: EventEmitter<customField> = new EventEmitter()

  private customFields: customField[] = []
  public unusedFields: customField[]

  public name: string

  public field: string

  private unsubscribeNotifier: Subject<any> = new Subject()
  @ViewChild('fieldDropdown') fieldDropdown: NgbDropdown;
  get placeholderText(): string {
    return $localize`Choose field`
  }

  get notFoundText(): string {
    return $localize`No unused fields found`
  }

   get canCreateFields(): boolean {
  /*   return this.permissionsService.currentUserCan(
      PermissionAction.Add,
      PermissionType.CustomField
    ) */
    return true
  } 

  constructor(
    private customFieldsService: CustomFieldsService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private permissionsService: PermissionsService
  ) {
    this.getFields()
  }

  ngOnDestroy(): void {
    this.unsubscribeNotifier.next(this)
    this.unsubscribeNotifier.complete()
  }

  private getFields() {
    this.customFieldsService
      .listAllCustom("list_customfield")
      .pipe(first(), takeUntil(this.unsubscribeNotifier))
      .subscribe((result) => {
        console.log(result.results)
        if (Array.isArray(result.results)) {
          this.customFields = result.results;
          console.log(this.customFields)
          this.updateUnusedFields();
        } else {
          console.error("result.results is not an array");
          // Handle the case when result.results is not an array
        }
      })
  }
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.fieldDropdown.toggle(); // Toggle the dropdown manually
}
  public getCustomFieldFromInstance(
    instance: CustomFieldInstance
  ): customField {
    return this.customFields.find((f) => f.id === instance.field)
  }

  private updateUnusedFields() {
    console.log(this.customFields)
    this.unusedFields = this.customFields.filter(
      (f) =>
        !this.existingFields?.find(
          (e) => this.getCustomFieldFromInstance(e)?.id === f.id
        )
    )
  }

  onOpenClose() {
    this.field = undefined
    this.updateUnusedFields()
  }

  addField() {
    console.log(this.customFields.find((f) => f.id === this.field));
    
    this.added.emit(this.customFields.find((f) => f.id === this.field))
  }

  createField(newName: string = null) {
    const modal = this.modalService.open(CustomFieldEditDialogComponent)
    if (newName) modal.componentInstance.object = { name: newName }
    modal.componentInstance.succeeded
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((newField) => {
        this.toastService.showInfo($localize`Saved field "${newField.name}".`)
        this.customFieldsService.clearCache()
        this.getFields()
        this.created.emit(newField)
      })
    modal.componentInstance.failed
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((e) => {
        this.toastService.showError($localize`Error saving field.`, e)
      })
  }
}
