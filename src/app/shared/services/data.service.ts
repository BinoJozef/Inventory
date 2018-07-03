import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  
  private subject = new BehaviorSubject<any>("Bos");
  sharedData$ = this.subject.asObservable();
  
  sendData(value: any) {
    this.subject.next(value)
  }
  
 
}
