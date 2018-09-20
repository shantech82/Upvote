import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { environment } from '../../environments/environment';
import { ILiveStream } from '../core/Model/ILiveStream';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class LivestreamService {

  constructor(private http: HttpClient) { }

  CreateLiveStream(LiveStreamData: ILiveStream) {
    return this.http.post<ILiveStream>(environment.ApiURL + 'ScheduleLiveStream', LiveStreamData, httpOptions)
    .map(data => _.values(data));
  }

  UpdateLiveStream(LiveStreamData: ILiveStream): Observable<ILiveStream> {
    return this.http.put<ILiveStream>(environment.ApiURL + 'UpdateLiveStream', LiveStreamData, httpOptions)
    .map(data => _.values(data));
  }

  StartStopLiveStream(LiveStreamData: ILiveStream): Observable<ILiveStream> {
    return this.http.put<ILiveStream>(environment.ApiURL + 'UpdateStatusLiveStream', LiveStreamData, httpOptions)
    .map(data => _.values(data));
  }

  GetLiveStream(Id): Observable<ILiveStream> {
    return this.http.get<ILiveStream>(environment.ApiURL + 'getLiveStream?icosid=' + Id)
    .map(data => _.values(data));
  }

  DeleteLiveStream(Id) {
    return this.http.delete(environment.ApiURL + 'deleteLiveStream/' + Id).toPromise();
  }

  deleteLiveStreamSystemCreated(Id) {
    return this.http.delete(environment.ApiURL + 'deleteLiveStreamSystemCreated/' + Id)
    .map(data => _.values(data));
  }
}
