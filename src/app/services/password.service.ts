import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';

@Injectable()
export class PasswordService {

  constructor(private http: HttpClient) { }

  GetVerifyPasswords(password, encryptPassword) {
    return this.http.get(environment.ApiURL + 'getVerifyPassword?password=' + password + '&encryptPassword=' + encryptPassword)
    .map(data => _.values(data));
  }
}
