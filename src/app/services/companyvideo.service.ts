import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 

import { Config } from '../app.config';

@Injectable()
export class CompanyvideoService {

  constructor(private http: Http) { }

  CreateCompanyVideo(CVidoeData){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});

    return this.http.post(Config.ApiURL + 'createCompanyvideo', JSON.stringify(CVidoeData), options)  
    .map((response: Response) =>response.json())              
  }  
  
  GetAllVideos(){       
    return this.http.get(Config.ApiURL + 'getAllVidoes')  
            .map((response: Response) => response.json())              
  }  

  GetVidoeById(Id){       
    return this.http.get(Config.ApiURL + 'getVideobyID/' + Id)  
            .map((response: Response) => response.json())              
  } 
  
  DeleteVidoeById(Id){       
    return this.http.delete(Config.ApiURL + 'deleteVideobyID/' + Id)  
            .map((response: Response) => response.json())              
  } 

  GetVidoesByCompany(Id){       
    return this.http.get(Config.ApiURL + 'getVidoesByCompany/' + Id)  
            .map((response: Response) => response.json())              
  } 

  GetVideoByUrl(vidoeurl){       
    return this.http.get(Config.ApiURL + 'getVideoByUrl?vidoeurl=' + vidoeurl)  
            .map((response: Response) => response.json())              
  } 
}
