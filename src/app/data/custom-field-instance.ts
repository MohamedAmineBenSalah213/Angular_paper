import { ObjectWithId } from './object-with-id'
import { customField } from './custom-field'

export interface CustomFieldInstance extends ObjectWithId {
  document: string // Document
  field: string // CustomField
  created: Date
  value?: any
}
