import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 
import { Config } from '../app.config';

@Injectable()
export class PasswordService {

  constructor(private http: Http) { }

  GetVerifyPasswords(password,encryptPassword){       
    return this.http.get(Config.ApiURL + 'getVerifyPassword?password=' + password +"&encryptPassword="+encryptPassword)  
            .map((response: Response) => response.json())              
  } 
}
