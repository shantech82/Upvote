import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class CompanyvideoService {

  constructor(private http: HttpClient) { }

  CreateCompanyVideo(CVidoeData) {
    return this.http.post(environment.ApiURL + 'createCompanyvideo', JSON.stringify(CVidoeData), httpOptions)
    .map(data => _.values(data));
  }

  GetAllVideos() {
    return this.http.get(environment.ApiURL + 'getAllVidoes')
    .map(data => _.values(data));
  }

  GetVidoeById(Id) {
    return this.http.get(environment.ApiURL + 'getVideobyID/' + Id)
    .map(data => _.values(data));
  }

  DeleteVidoeById(Id) {
    return this.http.delete(environment.ApiURL + 'deleteVideobyID/' + Id)
    .map(data => _.values(data));
  }

  GetVidoesByCompany(Id) {
    return this.http.get(environment.ApiURL + 'getVidoesByCompany/' + Id)
    .map(data => _.values(data));
  }

  GetVideoByUrl(vidoeurl) {
    return this.http.get(environment.ApiURL + 'getVideoByUrl?vidoeurl=' + vidoeurl)
    .map(data => _.values(data));
  }
}
