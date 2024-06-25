import { ObjectWithId } from './object-with-id'


export enum PaperlessTaskType {
  // just file tasks, for now
  File = 'file',
}

export enum DocumentSource {
  ConsumeFolder = 1,
 ApiUpload = 2,
 MailFetch = 3,
}

export interface PaperlessTask extends ObjectWithId {
  type: PaperlessTaskType

  source: DocumentSource

  acknowledged: boolean

  task_id: string

  task_file_name: string

  date_created: Date

  date_done?: Date

  result?: string

  related_document?: number
}
