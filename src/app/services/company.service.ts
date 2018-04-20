import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 

@Injectable()
export class CompanyService {

  constructor(private http: Http) { }

  CreateCompany(CompanyData){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});

    return this.http.post('http://localhost:3000/api/createCompany', JSON.stringify(CompanyData), options)  
    .map((response: Response) =>response.json())              
  }  
  
  GetAllCompany(){       
    return this.http.get('http://localhost:3000/api/getAllCompany/')  
            .map((response: Response) => response.json())              
  }  

  GetCompanyById(Id){       
    return this.http.get('http://localhost:3000/api/getCompanybyID/',Id)  
            .map((response: Response) => response.json())              
  } 
  
  GetCompanyByName(companyname){       
    return this.http.get('http://localhost:3000/api/getCompanybyName?companyname=' + companyname)  
            .map((response: Response) => response.json())              
  } 
}
