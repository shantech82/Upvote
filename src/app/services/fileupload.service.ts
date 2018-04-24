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
  }
  
  GetCompanyImage(filename){
    return this.http.get('http://localhost:3000/api/getCompanyLogo?filename=' + filename)  
    .map(files => files)             
  } 
}
