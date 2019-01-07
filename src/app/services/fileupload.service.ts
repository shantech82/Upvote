import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';
import { IliveStreamCalendar } from '../core/Model/ILiveStream';
import * as _ from 'lodash';
import { Observable } from '../../../node_modules/rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class FileuploadService {

  constructor(private http: HttpClient) { }

  UploadFiles(formData, existingfilename) {
    return this.http.post(environment.ApiURL + 'uploadFiles?existingfilename=' + existingfilename, formData)
      .map(returnvalues => _.values(returnvalues));
  }

  GetCompanyImage(filename) {
    return this.http.get(environment.ApiURL + 'getCompanyLogo?filename=' + filename)
      .map(files => files);
  }

  DeleteFile(filename) {
    return this.http.delete(environment.ApiURL + 'deleteFile?filename=' + filename)
      .map(message => _.values(message));
  }

  GenerateFile(filename) {
    return this.http.get(environment.ApiURL + 'generateFiles?filename=' + filename)
    .map(status => _.values(status));
  }

  GetLiveStreamICS(livestreamCalendar: IliveStreamCalendar) {
    return this.http.post(environment.ApiURL + 'getCalendar', livestreamCalendar, httpOptions)
      .map(filename => filename.toString());
  }

  GetAllFilesName() {
    return this.http.get(environment.ApiURL + 'getAllFileName')
    .map(filenamedata => _.values(filenamedata));
  }

  checkFileURL(filename) {
    return this.http.get(environment.ApiURL + 'checkFileisAvailable?filename=' + filename)
    .map(status => _.values(status));
  }
}
