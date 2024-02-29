import { Injectable } from '@angular/core'
import { ParamMap, Router } from '@angular/router'
import { Observable, Subject, first, takeUntil } from 'rxjs'
import { FilterRule } from '../data/filter-rule'
import {
  filterRulesDiffer,
  cloneFilterRules,
  isFullTextFilterRule,
} from '../utils/filter-rules'
import { PaperlessDocument } from '../data/paperless-document'
import { PaperlessSavedView } from '../data/paperless-saved-view'
import { SETTINGS_KEYS } from '../data/paperless-uisettings'
import { DOCUMENT_LIST_SERVICE } from '../data/storage-keys'
import { paramsFromViewState, paramsToViewState } from '../utils/query-params'
import {
  DocumentService,
  DOCUMENT_SORT_FIELDS,
  SelectionData,
} from './rest/document.service'
import { SettingsService } from './settings.service'

/**
 * Captures the current state of the list view.
 */
export interface ListViewState {
  /**
   * Title of the document list view. Either "Documents" (localized) or the name of a saved view.
   */
  title?: string

  /**
   * Current paginated list of documents displayed.
   */
  documents?: PaperlessDocument[]

  currentPage: number

  /**
   * Total amount of documents with the current filter rules. Used to calculate the number of pages.
   */
  collectionSize?: number

  /**
   * Currently selected sort field.
   */
  sortField: string

  /**
   * True if the list is sorted in reverse.
   */
  sortReverse: boolean

  /**
   * Filter rules for the current list view.
   */
  filterRules: FilterRule[]

  /**
   * Contains the IDs of all selected documents.
   */
  selected?: Set<string>
}

/**
 * This service manages the document list which is displayed using the document list view.
 *
 * This service also serves saved views by transparently switching between the document list
 * and saved views on request. See below.
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentListViewService {
  isReloading: boolean = false
  initialized: boolean = false
  error: string = null

  rangeSelectionAnchorIndex: number
  lastRangeSelectionToIndex: number

  selectionData?: SelectionData

  currentPageSize: number = this.settings.get(SETTINGS_KEYS.DOCUMENT_LIST_SIZE)

  private unsubscribeNotifier: Subject<any> = new Subject()

  private listViewStates: Map<string, ListViewState> = new Map()

  private _activeSavedViewId: string = null

  get activeSavedViewId() {
    return this._activeSavedViewId
  }

  get activeSavedViewTitle() {
    return this.activeListViewState.title
  }

  constructor(
    private documentService: DocumentService,
    private settings: SettingsService,
    private router: Router
  ) {
    let documentListViewConfigJson = localStorage.getItem(
      DOCUMENT_LIST_SERVICE.CURRENT_VIEW_CONFIG
    )
    if (documentListViewConfigJson) {
      try {
        let savedState: ListViewState = JSON.parse(documentListViewConfigJson)
        // Remove null elements from the restored state
        Object.keys(savedState).forEach((k) => {
          if (savedState[k] == null) {
            delete savedState[k]
          }
        })
        //only use restored state attributes instead of defaults if they are not null
        let newState = Object.assign(this.defaultListViewState(), savedState)
        this.listViewStates.set(null, newState)
      } catch (e) {
        localStorage.removeItem(DOCUMENT_LIST_SERVICE.CURRENT_VIEW_CONFIG)
      }
    }
  }

  private defaultListViewState(): ListViewState {
    return {
      title: null,
      documents: [],
      currentPage: 1,
      collectionSize: null,
      sortField: 'created',
      sortReverse: true,
      filterRules: [],
      selected: new Set<string>(),
    }
  }

  private get activeListViewState() {
    if (!this.listViewStates.has(this._activeSavedViewId)) {
      this.listViewStates.set(
        this._activeSavedViewId,
        this.defaultListViewState()
      )
    }
    return this.listViewStates.get(this._activeSavedViewId)
  }

  public cancelPending(): void {
    this.unsubscribeNotifier.next(true)
  }

  activateSavedView(view: PaperlessSavedView) {
    this.rangeSelectionAnchorIndex = this.lastRangeSelectionToIndex = null
    if (view) {
      this._activeSavedViewId = view.id
      this.loadSavedView(view)
    } else {
      this._activeSavedViewId = null
    }
  }

  activateSavedViewWithQueryParams(
    view: PaperlessSavedView,
    queryParams: ParamMap
  ) {
    const viewState = paramsToViewState(queryParams)
    this.activateSavedView(view)
    this.currentPage = viewState.currentPage
  }

  loadSavedView(view: PaperlessSavedView, closeCurrentView: boolean = false) {
    if (closeCurrentView) {
      this._activeSavedViewId = null
    }

    this.activeListViewState.filterRules = cloneFilterRules(view.filter_rules)
    this.activeListViewState.sortField = view.sort_field
    this.activeListViewState.sortReverse = view.sort_reverse
    if (this._activeSavedViewId) {
      this.activeListViewState.title = view.name
    }

    this.reduceSelectionToFilter()

    if (!this.router.routerState.snapshot.url.includes('/view/')) {
      this.router.navigate(['view', view.id])
    }
  }

  loadFromQueryParams(queryParams: ParamMap) {
    const paramsEmpty: boolean = queryParams.keys.length == 0
    let newState: ListViewState = this.listViewStates.get(
      this._activeSavedViewId
    )
    if (!paramsEmpty) newState = paramsToViewState(queryParams)
    if (newState == undefined) newState = this.defaultListViewState() // if nothing in local storage

    // only reload if things have changed
    if (
      !this.initialized ||
      paramsEmpty ||
      this.activeListViewState.sortField !== newState.sortField ||
      this.activeListViewState.sortReverse !== newState.sortReverse ||
      this.activeListViewState.currentPage !== newState.currentPage ||
      filterRulesDiffer(
        this.activeListViewState.filterRules,
        newState.filterRules
      )
    ) {
      this.activeListViewState.filterRules = newState.filterRules
      this.activeListViewState.sortField = newState.sortField
      this.activeListViewState.sortReverse = newState.sortReverse
      this.activeListViewState.currentPage = newState.currentPage
      this.reload(null, paramsEmpty) // update the params if there arent any
    }
  }

  reload(onFinish?, updateQueryParams: boolean = true) {
    this.cancelPending()
    this.isReloading = true
    this.error = null
    let activeListViewState = this.activeListViewState
    console.log( this.documentService
      .listFiltered(
          null,
          null,
          null,
          null,
          null,
          "list_document",
          null
      ));
    
      this.documentService
      .listFiltered(
      null,
      null,
      null,
      null,
      null,
        "list_document",
       null
      )
      
      
    
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe({
        next: (result) => {
          this.initialized = true
          this.isReloading = false
          activeListViewState.collectionSize = result.totalItems
          activeListViewState.documents = result.data
          console.log(result);
         /*  this.documentService
            .getSelectionData(result.all)
            .pipe(first())
            .subscribe({
              next: (selectionData) => {
                this.selectionData = selectionData
              },
              error: () => {
                this.selectionData = null
              },
            }) */

         /*  if (updateQueryParams && !this._activeSavedViewId) {
            let base = ['/documents']
            this.router.navigate(base, {
              queryParams: paramsFromViewState(activeListViewState),
              replaceUrl: !this.router.routerState.snapshot.url.includes('?'), // in case navigating from params-less /documents
            })
          } else if (this._activeSavedViewId) {
            this.router.navigate([], {
              queryParams: paramsFromViewState(activeListViewState, true),
              queryParamsHandling: 'merge',
            })
          }

          if (onFinish) {
            onFinish()
          }  */
          this.rangeSelectionAnchorIndex = this.lastRangeSelectionToIndex = null
        },
        error: (error) => {
          console.log('Error object:', error); // Log the entire error object
          console.log('Error message:', error.error); // Log the error message
          this.isReloading = false
          if (activeListViewState.currentPage != 1 && error.status == 404) {
            // this happens when applying a filter: the current page might not be available anymore due to the reduced result set.
            activeListViewState.currentPage = 1
            this.reload()
          } else {
            this.selectionData = null
            let errorMessage
            if (
              typeof error.error !== 'string' &&
              Object.keys(error.error).length > 0
            ) {
              // e.g. { archive_serial_number: Array<string> }
              errorMessage = Object.keys(error.error)
                .map((fieldName) => {
                  const fieldError: Array<string> = error.error[fieldName]
                  return `${DOCUMENT_SORT_FIELDS.find(
                    (f) => f.field == fieldName
                  )?.name}: ${fieldError[0]}`
                })
                .join(', ')
            } else {
              errorMessage = error.error
            }
            this.error = errorMessage
          }
        },
      });
  

       /*  activeListViewState.currentPage,
      this.currentPageSize,
      activeListViewState.sortField,
      activeListViewState.sortReverse,
      activeListViewState.filterRules,
      { truncate_content: true } */
    
}

  set filterRules(filterRules: FilterRule[]) {
    if (
      !isFullTextFilterRule(filterRules) &&
      this.activeListViewState.sortField == 'score'
    ) {
      this.activeListViewState.sortField = 'created'
    }
    this.activeListViewState.filterRules = filterRules
    this.reload()
    this.reduceSelectionToFilter()
    this.saveDocumentListView()
  }

  get filterRules(): FilterRule[] {
    return this.activeListViewState.filterRules
  }

  set sortField(field: string) {
    this.activeListViewState.sortField = field
    this.reload()
    this.saveDocumentListView()
  }

  get sortField(): string {
    return this.activeListViewState.sortField
  }

  set sortReverse(reverse: boolean) {
    this.activeListViewState.sortReverse = reverse
    this.reload()
    this.saveDocumentListView()
  }

  get sortReverse(): boolean {
    return this.activeListViewState.sortReverse
  }

  get collectionSize(): number {
    return this.activeListViewState.collectionSize
  }

  get currentPage(): number {
    return this.activeListViewState.currentPage
  }

  set currentPage(page: number) {
    if (this.activeListViewState.currentPage == page) return
    this.activeListViewState.currentPage = page
    this.reload()
    this.saveDocumentListView()
  }

  get documents(): PaperlessDocument[] {
    return this.activeListViewState.documents
  }

  get selected(): Set<string> {
    return this.activeListViewState.selected
  }

  setSort(field: string, reverse: boolean) {
    this.activeListViewState.sortField = field
    this.activeListViewState.sortReverse = reverse
    this.reload()
    this.saveDocumentListView()
  }

  private saveDocumentListView() {
    if (this._activeSavedViewId == null) {
      let savedState: ListViewState = {
        collectionSize: this.activeListViewState.collectionSize,
        currentPage: this.activeListViewState.currentPage,
        filterRules: this.activeListViewState.filterRules,
        sortField: this.activeListViewState.sortField,
        sortReverse: this.activeListViewState.sortReverse,
      }
      localStorage.setItem(
        DOCUMENT_LIST_SERVICE.CURRENT_VIEW_CONFIG,
        JSON.stringify(savedState)
      )
    }
  }

  quickFilter(filterRules: FilterRule[]) {
    this._activeSavedViewId = null
    this.filterRules = filterRules
    this.router.navigate(['documents'])
  }

  getLastPage(): number {
    return Math.ceil(this.collectionSize / this.currentPageSize)
  }

  hasNext(doc: string) {
    if (this.documents) {
      let index = this.documents.findIndex((d) => d.id == doc)
      return (
        index != -1 &&
        (this.currentPage < this.getLastPage() ||
          index + 1 < this.documents.length)
      )
    }
  }

  hasPrevious(doc: string) {
    if (this.documents) {
      let index = this.documents.findIndex((d) => d.id == doc)
      return index != -1 && !(index == 0 && this.currentPage == 1)
    }
  }

  getNext(currentDocId: string): Observable<string> {
    return new Observable((nextDocId) => {
      if (this.documents != null) {
        let index = this.documents.findIndex((d) => d.id == currentDocId)

        if (index != -1 && index + 1 < this.documents.length) {
          nextDocId.next(this.documents[index + 1].id)
          nextDocId.complete()
        } else if (index != -1 && this.currentPage < this.getLastPage()) {
          this.currentPage += 1
          this.reload(() => {
            nextDocId.next(this.documents[0].id)
            nextDocId.complete()
          })
        } else {
          nextDocId.complete()
        }
      } else {
        nextDocId.complete()
      }
    })
  }

  getPrevious(currentDocId: string): Observable<string> {
    return new Observable((prevDocId) => {
      if (this.documents != null) {
        let index = this.documents.findIndex((d) => d.id == currentDocId)

        if (index != 0) {
          prevDocId.next(this.documents[index - 1].id)
          prevDocId.complete()
        } else if (this.currentPage > 1) {
          this.currentPage -= 1
          this.reload(() => {
            prevDocId.next(this.documents[this.documents.length - 1].id)
            prevDocId.complete()
          })
        } else {
          prevDocId.complete()
        }
      } else {
        prevDocId.complete()
      }
    })
  }

  updatePageSize() {
    let newPageSize = this.settings.get(SETTINGS_KEYS.DOCUMENT_LIST_SIZE)
    if (newPageSize != this.currentPageSize) {
      this.currentPageSize = newPageSize
    }
  }

  selectNone() {
    this.selected.clear()
    this.rangeSelectionAnchorIndex = this.lastRangeSelectionToIndex = null
  }

  reduceSelectionToFilter() {
    if (this.selected.size > 0) {
      this.documentService
        .listAllFilteredIds(this.filterRules)
        .subscribe((ids) => {
          for (let id of this.selected) {
            if (!ids.includes(id)) {
              this.selected.delete(id)
            }
          }
        })
    }
  }

  selectAll() {
    this.documentService
      .listAllFilteredIds(this.filterRules)
      .subscribe((ids) => ids.forEach((id) => this.selected.add(id)))
  }

  selectPage() {
    this.selected.clear()
    this.documents.forEach((doc) => {
      this.selected.add(doc.id)
    })
  }

  isSelected(d: PaperlessDocument) {
    return this.selected.has(d.id)
  }

  toggleSelected(d: PaperlessDocument): void {
    if (this.selected.has(d.id)) this.selected.delete(d.id)
    else this.selected.add(d.id)
    this.rangeSelectionAnchorIndex = this.documentIndexInCurrentView(d.id)
    this.lastRangeSelectionToIndex = null
  }

  selectRangeTo(d: PaperlessDocument) {
    if (this.rangeSelectionAnchorIndex !== null) {
      const documentToIndex = this.documentIndexInCurrentView(d.id)
      const fromIndex = Math.min(
        this.rangeSelectionAnchorIndex,
        documentToIndex
      )
      const toIndex = Math.max(this.rangeSelectionAnchorIndex, documentToIndex)

      if (this.lastRangeSelectionToIndex !== null) {
        // revert the old selection
        this.documents
          .slice(
            Math.min(
              this.rangeSelectionAnchorIndex,
              this.lastRangeSelectionToIndex
            ),
            Math.max(
              this.rangeSelectionAnchorIndex,
              this.lastRangeSelectionToIndex
            ) + 1
          )
          .forEach((d) => {
            this.selected.delete(d.id)
          })
      }

      this.documents.slice(fromIndex, toIndex + 1).forEach((d) => {
        this.selected.add(d.id)
      })
      this.lastRangeSelectionToIndex = documentToIndex
    } else {
      // e.g. shift key but was first click
      this.toggleSelected(d)
    }
  }

  documentIndexInCurrentView(documentID: string): number {
    return this.documents.map((d) => d.id).indexOf(documentID)
  }
}
