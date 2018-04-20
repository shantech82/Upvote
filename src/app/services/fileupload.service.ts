import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do';

@Injectable()
export class FileuploadService {

  constructor(private http: Http) { }

  UploadCompanyImage(formData){
    this.http.post('http://localhost:3000/api/uploadCompanyLogo', formData)
    .map(files => files.json())
    .subscribe(files => console.log('files', files))           
  }
  
  RegisterUser(formData){
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    let options = new RequestOptions({headers: headers});

    return this.http.post('http://localhost:3000/api/SaveRegistration', formData, options)  
    .map((response: Response) =>response.json())              
  }  

}
