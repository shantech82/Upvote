import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 

import { Config } from '../app.config';

@Injectable()
export class CompanyService {

  constructor(private http: Http) { }

  CreateCompany(CompanyData){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});

    return this.http.post(Config.ApiURL + 'createCompany', JSON.stringify(CompanyData), options)  
    .map((response: Response) =>response.json())              
  }  
  
  GetAllCompany(){       
    return this.http.get(Config.ApiURL + 'getAllCompany/')  
            .map((response: Response) => response.json())              
  }  

  GetCompanyById(Id){       
    return this.http.get(Config.ApiURL + 'getCompanybyID/',Id)  
            .map((response: Response) => response.json())              
  } 
  
  GetCompanyByName(companyname,email){       
    return this.http.get(Config.ApiURL + 'getCompanybyName?companyname=' + companyname + '&&email=' + email)  
            .map((response: Response) => response.json())              
  } 
}
