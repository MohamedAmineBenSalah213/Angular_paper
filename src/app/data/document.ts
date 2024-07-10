import { correspondent } from './correspondent'
import { tag } from './tag'
import { documentType } from './document-type'
import { Observable } from 'rxjs'
import { storagePath } from './storage-path'
import { ObjectWithPermissions } from './object-with-permissions'

import { CustomFieldInstance } from './custom-field-instance'
import { documentNote } from './document-note'

export interface SearchHit {
  score?: number
  rank?: number

  highlights?: string
  note_highlights?: string
}

export interface document extends ObjectWithPermissions {
 correspondent$?: Observable<correspondent>

  correspondentId?: string

  document_type$?: Observable<documentType>

  documentTypeId?: string

   storage_path$?: Observable<storagePath>

   storagePathId?: string 
  
  title?: string

  content?: string
 

  tags$?: Observable<tag[]>

  tags?: string[]
 
  // UTC
  createdOn?: Date

  // localized date
  created_date?: Date

  modified?: Date

  original_file_name?: string
  
  download_url?: string

  thumbnail_url?: string 

  archive_serial_number?: number

  notes?: documentNote[]

  __search_hit__?: SearchHit

  custom_fields?: CustomFieldInstance[] 
}
