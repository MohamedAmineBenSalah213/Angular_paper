import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureAdDemoService {
 isUserLoggedInAzureDemo:Subject<boolean>=new Subject<boolean>();
  constructor() { }
}
