import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { documentNote } from 'src/app/data/document-note'
import { AbstractService } from './abstract-service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class documentNotesService extends AbstractService<documentNote> {
  constructor(http: HttpClient) {
    super(http, 'document')
  }

  getNotes(documentId: string): Observable<documentNote[]> {
    return this.http.get<documentNote[]>(
      this.getResourceUrl(documentId, 'getnotes')
    )
  }

  addNote(id: string, note: string): Observable<documentNote> {
    return this.http.post<documentNote>(
      this.getResourceUrl(id, 'notes'),
      { note: note }
    )
  }

  deleteNote(
    documentId: string,
    noteId: string
  ): Observable<documentNote> {
    return this.http.delete<documentNote>(
      `http://localhost:63092/document/${documentId}/notes/${noteId}`
    );
  }
}
