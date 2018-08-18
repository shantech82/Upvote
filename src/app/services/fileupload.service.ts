import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'path';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';
import { Utility } from '../Shared/Utility';

@Injectable()
export class FileuploadService {

  constructor(private http: HttpClient) { }

  UploadCompanyImage(formData) {
    return this.http.post(environment.ApiURL + 'uploadCompanyLogo', formData)
      .map(filename => filename.toString());
  }

  GetCompanyImage(filename) {
    return this.http.get(environment.ApiURL + 'getCompanyLogo?filename=' + filename)
      .map(files => files);
  }

  DeleteFile(filename) {
    return this.http.delete(environment.ApiURL + 'deleteFile?filename=' + filename)
      .map(message => message);
  }
}
