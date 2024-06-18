import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import {
  PaperlessTask,
  PaperlessTaskStatus,
  PaperlessTaskType,
} from 'src/app/data/paperless-task'
import { environment } from 'src/environments/environment'
import { DocumentSource } from '../data/paperless-consumption-template'

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
    return this.fileTasks.filter((t) => t.source == DocumentSource.ConsumeFolder)
  }

  public get startedFileTasks(): PaperlessTask[] {
    return this.fileTasks.filter((t) => t.source == DocumentSource.ApiUpload)
  }

  public get completedFileTasks(): PaperlessTask[] {
    return this.fileTasks.filter(
      (t) => t.source == DocumentSource.MailFetch
    )
  }

  constructor(private http: HttpClient) {}

  public reload() {
    this.loading = true
 //  debugger
    this.http
      .get<PaperlessTask[]>(`${this.baseUrl}/filetask/list_file_tasks`)
      .pipe(takeUntil(this.unsubscribeNotifer), first())
     .subscribe((r) => {
      this.fileTasks = r// they're all File tasks, for now
      console.log(this.fileTasks);
      
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
