import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do';
import { Config } from '../app.config';

@Injectable()
export class FileuploadService {

  constructor(private http: Http) { }

  UploadCompanyImage(formData){
   return this.http.post(Config.ApiURL + 'uploadCompanyLogo', formData)
        .map((response: Response) => response.json())       
  }
  
  GetCompanyImage(filename){
    return this.http.get(Config.ApiURL + 'getCompanyLogo?filename=' + filename)  
    .map(files => files)             
  } 
}
