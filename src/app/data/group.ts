import { ObjectWithId } from './object-with-id'

export interface group extends ObjectWithId {
  name?: string

  user_count?: number // not implemented yet

  permissions?: string[]
}
