import { ObjectWithId } from './object-with-id'
import { DocumentSource } from './consumption-template'
import { document } from './document'

export enum TaskType {
  // just file tasks, for now
  File = 'file',
}

export enum TaskStatus {
  Pending = 'PENDING',
  Started = 'STARTED',
  Complete = 'SUCCESS',
  Failed = "Failed",
  
}
export enum Problem
{
    NoOwner = 1,
    NoCorrespondent = 2,
    NoOwnerNoCorrespondent = 3,
    None=4
}

export interface task extends ObjectWithId {
  type: TaskType

  status: TaskStatus
  task_problem : Problem
  source: DocumentSource
  task_document : document

  acknowledged: boolean

  task_id: string

  task_file_name: string

  date_created: Date

  date_done?: Date

  result?: string

  related_document?: number
}
