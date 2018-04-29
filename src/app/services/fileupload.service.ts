import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do';
import { ApiService } from './ServiceConfig';

@Injectable()
export class FileuploadService {

  constructor(private http: Http) { }

  UploadCompanyImage(formData){
    this.http.post(ApiService.URL + 'uploadCompanyLogo', formData)
    .map(files => files.json())
  }
  
  GetCompanyImage(filename){
    return this.http.get(ApiService.URL + 'getCompanyLogo?filename=' + filename)  
    .map(files => files)             
  } 
}
