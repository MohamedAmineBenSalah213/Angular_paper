import { ObjectWithId } from './object-with-id'

export interface documentNote extends ObjectWithId {
  created?: Date
  note?: string
  user?: string 
}
