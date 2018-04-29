import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 
import { ApiService } from './ServiceConfig';

@Injectable()
export class RegistrationService {

  constructor(private http: Http) { }

  RegisterUser(UserData){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});

    return this.http.post(ApiService.URL + 'SaveRegistration', JSON.stringify(UserData), options)  
    .map((response: Response) =>response.json())              
  }  
  
  GetAllUser(){       
    return this.http.get(ApiService.URL + 'Registrations/')  
            .map((response: Response) => response.json())              
  }  

  GetSingleUser(Id){       
    return this.http.get(ApiService.URL + 'Registrations/',Id)  
            .map((response: Response) => response.json())              
  } 
  
  GetUserEmail(email){       
    return this.http.get(ApiService.URL + 'getRegistrationemail?email=' + email)  
            .map((response: Response) => response.json())              
  } 

  GetUserSignIn(email,password){       
    return this.http.get(ApiService.URL + 'getUserSignIn?email=' + email + '&password=' + password)  
            .map((response: Response) => response.json())              
  } 

  PutActivateUser(email,key){ 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});      
    return this.http.put(ApiService.URL + 'putUserActivate?email=' + email + '&activatekey=' + key,options)  
            .map((response: Response) => response.json())              
  } 

}
