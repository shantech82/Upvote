
import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 
import { Config } from '../app.config';

@Injectable()
export class EmailService {

  constructor(private http: Http) { }

  SendActivateMail(MailData){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});

    return this.http.post(Config.ApiURL + 'sendActivateMail', JSON.stringify(MailData), options)  
    .map((response: Response) =>response.json())              
  } 
}
