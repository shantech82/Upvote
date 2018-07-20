
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { resolve } from 'path';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class EmailService {

  constructor(private http: HttpClient) { }

  SendActivateMail(MailData) {
    return this.http.post(environment.ApiURL + 'sendActivateMail', JSON.stringify(MailData), httpOptions)
    .map(data => _.values(data));
  }
}
