import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 
import { Config } from '../app.config';

@Injectable()
export class RegistrationService {

  constructor(private http: Http) { }

  RegisterUser(UserData){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});

    return this.http.post(Config.ApiURL + 'SaveRegistration', JSON.stringify(UserData), options)  
    .map((response: Response) =>response.json())              
  }  
  
  GetAllUser(){       
    return this.http.get(Config.ApiURL + 'Registrations/')  
            .map((response: Response) => response.json())              
  }  

  GetSingleUser(Id){       
    return this.http.get(Config.ApiURL + 'Registrations/',Id)  
            .map((response: Response) => response.json())              
  } 
  
  GetUserEmail(email){       
    return this.http.get(Config.ApiURL + 'getRegistrationemail?email=' + email)  
            .map((response: Response) => response.json())              
  } 

  GetUserSignIn(email,password){       
    return this.http.get(Config.ApiURL + 'getUserSignIn?email=' + email + '&password=' + password)  
            .map((response: Response) => response.json())              
  } 

  PutActivateUser(email,key){ 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});      
    return this.http.put(Config.ApiURL + 'putUserActivate?email=' + email + '&activatekey=' + key,options)  
            .map((response: Response) => response.json())              
  } 

}
