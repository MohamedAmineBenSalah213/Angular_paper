import { ObjectWithId } from './object-with-id'
import { DocumentSource } from './paperless-consumption-template'
import { PaperlessDocument } from './paperless-document'

export enum PaperlessTaskType {
  // just file tasks, for now
  File = 'file',
}

export enum PaperlessTaskStatus {
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

export interface PaperlessTask extends ObjectWithId {
  type: PaperlessTaskType

  status: PaperlessTaskStatus
  task_problem : Problem
  source: DocumentSource
  task_document : PaperlessDocument

  acknowledged: boolean

  task_id: string

  task_file_name: string

  date_created: Date

  date_done?: Date

  result?: string

  related_document?: number
}
