import { PaperlessCorrespondent } from './paperless-correspondent'
import { PaperlessTag } from './paperless-tag'
import { PaperlessDocumentType } from './paperless-document-type'
import { Observable } from 'rxjs'
import { PaperlessStoragePath } from './paperless-storage-path'
import { ObjectWithPermissions } from './object-with-permissions'
import { PaperlessDocumentNote } from './paperless-document-note'
import { PaperlessCustomFieldInstance } from './paperless-custom-field-instance'

export interface SearchHit {
  score?: number
  rank?: number

  highlights?: string
  note_highlights?: string
}

export interface PaperlessDocument extends ObjectWithPermissions {
  /* correspondent$?: Observable<PaperlessCorrespondent>

  correspondent?: string

  document_type$?: Observable<PaperlessDocumentType>

  document_type?: string

  storage_path$?: Observable<PaperlessStoragePath>

  storage_path?: string
  fileData :string */
  title?: string

  content?: string
  added?: Date
  created?: Date

 /*  tags$?: Observable<PaperlessTag[]>

  tags?: string[]

  checksum?: string
 
  // UTC
  created?: Date

  // localized date
  created_date?: Date

  modified?: Date

  
 
  original_file_name?: string
  
  download_url?: string

  thumbnail_url?: string */

  archive_serial_number?: number

 /*  notes?: PaperlessDocumentNote[]

  __search_hit__?: SearchHit

  custom_fields?: PaperlessCustomFieldInstance[] */
}
