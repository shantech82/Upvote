import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

  private icolist = new Subject<any>();
  constructor() { }

  icolistdata$ = this.icolist.asObservable();

  getICOLIst(icolist: any) {
    this.icolist.next(icolist);
  }
}
