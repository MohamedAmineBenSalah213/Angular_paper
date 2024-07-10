import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { filter, first, map, Subject, switchMap, takeUntil } from 'rxjs'
import { FilterRule } from 'src/app/data/filter-rule'
import {
  filterRulesDiffer,
  isFullTextFilterRule,
} from 'src/app/utils/filter-rules'
import { FILTER_FULLTEXT_MORELIKE } from 'src/app/data/filter-rule-type'
import { document } from 'src/app/data/document'
import { SETTINGS_KEYS } from 'src/app/data/uisettings'
import {
  SortableDirective,
  SortEvent,
} from 'src/app/directives/sortable.directive'
import { ConsumerStatusService } from 'src/app/services/consumer-status.service'
import { DocumentListViewService } from 'src/app/services/document-list-view.service'
import { OpenDocumentsService } from 'src/app/services/open-documents.service'
import {
  DOCUMENT_SORT_FIELDS,
  DOCUMENT_SORT_FIELDS_FULLTEXT,
} from 'src/app/services/rest/document.service'
import { SettingsService } from 'src/app/services/settings.service'
import { ToastService } from 'src/app/services/toast.service'
import { ComponentWithPermissions } from '../with-permissions/with-permissions.component'
import { FilterEditorComponent } from './filter-editor/filter-editor.component'
import { savedview } from 'src/app/data/savedView'


@Component({
  selector: 'pngx-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent
  extends ComponentWithPermissions
  implements OnInit, OnDestroy
{
  constructor(
    public list: DocumentListViewService,
    public route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal,
    private consumerStatusService: ConsumerStatusService,
    public openDocumentsService: OpenDocumentsService,
    private settingsService: SettingsService,
   
  ) {
    super()
  }

  @ViewChild('filterEditor')
  private filterEditor: FilterEditorComponent

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>

  displayMode = 'smallCards' // largeCards, smallCards, details

  unmodifiedFilterRules: FilterRule[] = []
  private unmodifiedSavedView: savedview

  private unsubscribeNotifier: Subject<any> = new Subject()

   get savedViewIsModified(): boolean {
    if (!this.list.activeSavedViewId || !this.unmodifiedSavedView) return false
    else {
      return (
        this.unmodifiedSavedView.sort_field !== this.list.sortField ||
        this.unmodifiedSavedView.sort_reverse !== this.list.sortReverse ||
        filterRulesDiffer(
          this.unmodifiedSavedView.filter_rules,
          this.list.filterRules
        )
      )
    }
  }

  get isFiltered() {
    return this.list.filterRules?.length > 0
  }

  getTitle() {
    let title = this.list.activeSavedViewTitle
  /*   if (title && this.savedViewIsModified) {
      title += '*'
    } else  */if (!title) {
      title = $localize`Documents`
    }
    return title
  }

  getSortFields() {
    return isFullTextFilterRule(this.list.filterRules)
      ? DOCUMENT_SORT_FIELDS_FULLTEXT
      : DOCUMENT_SORT_FIELDS
  }

  set listSortReverse(reverse: boolean) {
    this.list.sortReverse = reverse
  }

  get listSortReverse(): boolean {
    return this.list.sortReverse
  }

  setSortField(field: string) {
    this.list.sortField = field
  }

  onSort(event: SortEvent) {
    this.list.setSort(event.column, event.reverse)
  }

  get isBulkEditing(): boolean {
    return this.list.selected.size > 0
  }

  saveDisplayMode() {
    console.log(this.displayMode);
    localStorage.setItem('document-list:displayMode', this.displayMode)
  }

  ngOnInit(): void {

       debugger

    if (localStorage.getItem('document-list:displayMode') != null) {
      this.displayMode = localStorage.getItem('document-list:displayMode')
    }

    this.consumerStatusService
      .onDocumentConsumptionFinished()
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe(() => {
        this.list.reload()
       // debugger
      })

   
    this.route.queryParamMap
      .pipe(
        filter(() => !this.route.snapshot.paramMap.has('id')), // only when not on /view/id
        takeUntil(this.unsubscribeNotifier)
      )
      .subscribe((queryParams) => {
        if (queryParams.has('view')) {
          // loading a saved view on /documents
         /*  this.loadViewConfig(parseInt(queryParams.get('view'))) */
        } else {
          this.list.activateSavedView(null)
          this.list.loadFromQueryParams(queryParams)
          this.unmodifiedFilterRules = []
        }
      })
  }

  ngOnDestroy() {
    this.list.cancelPending()
    this.unsubscribeNotifier.next(this)
    this.unsubscribeNotifier.complete()
  }

  


 

  openDocumentDetail(document: document) {
    console.log(document.id)
    this.router.navigate(['documents', document.id])
  }

  toggleSelected(document: document, event: MouseEvent): void {
    console.log(document.title);
    
    if (!event.shiftKey) this.list.toggleSelected(document)
    else this.list.selectRangeTo(document)
  }

  clickTag(tagID: string) {
    this.list.selectNone()
    this.filterEditor.toggleTag(tagID)
  }

  clickCorrespondent(correspondentID: string) {
    this.list.selectNone()
    this.filterEditor.toggleCorrespondent(correspondentID)
  }

  clickDocumentType(documentTypeID: string) {
    this.list.selectNone()
    this.filterEditor.toggleDocumentType(documentTypeID)
  }

  clickStoragePath(storagePathID: string) {
    this.list.selectNone()
    this.filterEditor.toggleStoragePath(storagePathID)
  }

  clickMoreLike(documentID: string) {
    this.list.quickFilter([
      { rule_type: FILTER_FULLTEXT_MORELIKE, value: documentID.toString() },
    ])
  }

  trackByDocumentId(index, item: document) {
  //  console.log(item.id)
    return item.id
  }

  get notesEnabled(): boolean {
    return this.settingsService.get(SETTINGS_KEYS.NOTES_ENABLED)
  }

  resetFilters() {
    this.filterEditor.resetSelected()
  }
}
