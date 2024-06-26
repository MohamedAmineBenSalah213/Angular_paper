import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { PaperlessDocumentNote } from 'src/app/data/paperless-document-note'
import { AbstractPaperlessService } from './abstract-paperless-service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DocumentNotesService extends AbstractPaperlessService<PaperlessDocumentNote> {
  constructor(http: HttpClient) {
    super(http, 'document')
  }

  getNotes(documentId: string): Observable<PaperlessDocumentNote[]> {
    return this.http.get<PaperlessDocumentNote[]>(
      this.getResourceUrl(documentId, 'getnotes')
    )
  }

  addNote(id: string, note: string): Observable<PaperlessDocumentNote[]> {
    return this.http.post<PaperlessDocumentNote[]>(
      this.getResourceUrl(id, 'notes'),
      { note: note }
    )
  }

  deleteNote(
    documentId: string,
    noteId: string
  ): Observable<PaperlessDocumentNote[]> {
    return this.http.delete<PaperlessDocumentNote[]>(
      this.getResourceUrl(documentId, 'notes'),
      { params: new HttpParams({ fromString: `id=${noteId}` }) }
    )
  }
}
