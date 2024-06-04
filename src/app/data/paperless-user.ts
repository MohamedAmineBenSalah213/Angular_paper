import { ObjectWithId } from './object-with-id'

export interface PaperlessUser extends ObjectWithId {
  userName?: string
   first_name?: string
  last_name?: string
  email?:string
  normalizedUserName?:string
  passwordHash?:string
  date_joined?: Date
  is_staff?: boolean
  is_active?: boolean
  is_superuser?: boolean
  groups?: string[] // PaperlessGroup[]
  user_permissions?: string[]
  inherited_permissions?: string[] 
}

