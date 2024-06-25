import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import {
  DocumentSource,
  PaperlessTask,
  PaperlessTaskType,
} from 'src/app/data/paperless-task'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private baseUrl: string = environment.apiBaseUrl

  public loading: boolean

  private fileTasks: PaperlessTask[] = []

  private unsubscribeNotifer: Subject<any> = new Subject()

  public get total(): number {
    return this.fileTasks.length
  }

  public get allFileTasks(): PaperlessTask[] {
    return this.fileTasks.slice(0)
  }

  public get queuedFileTasks(): PaperlessTask[] {
    return this.fileTasks.filter((t) => t.source == DocumentSource.MailFetch)
  }

  public get startedFileTasks(): PaperlessTask[] {
    return this.fileTasks.filter((t) => t.source == DocumentSource.ConsumeFolder)
  }

  public get completedFileTasks(): PaperlessTask[] {
    return this.fileTasks.filter(
      (t) => t.source == DocumentSource.ApiUpload   )
  }

 

  constructor(private http: HttpClient) {}

  public reload() {
    debugger
    this.loading = true

    this.http
      .get<any>(`${this.baseUrl}/filetask/list_file_tasks`)
      .pipe(takeUntil(this.unsubscribeNotifer), first())
     .subscribe((r) => {
      this.fileTasks = r.filter((t) => t.type == PaperlessTaskType.File) // they're all File tasks, for now
        this.loading = false
      })
  }

  public dismissTasks(task_ids: Set<string>) {
    this.http
      .post(`${this.baseUrl}acknowledge_tasks/`, {
        tasks: [...task_ids],
      })
      .pipe(takeUntil(this.unsubscribeNotifer), first())
      .subscribe((r) => {
        this.reload()
      })
  }

  public cancelPending(): void {
    this.unsubscribeNotifer.next(true)
  }
}
