import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import * as _ from 'lodash';
import { IUser } from '../core/Model/IUser';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { environment } from '../../environments/environment';
import { IInvestorICOs } from '../core/Model/IInvestorICOs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class RegistrationService {

  constructor(private http: HttpClient) { }

  RegisterUser(userData: IUser): Observable<IUser> {
    return this.http.post<IUser>(environment.ApiURL + 'SaveRegistration', JSON.stringify(userData), httpOptions)
      .map(data => _.values(data));
  }

  UpdateICOUserProfile(userData: IUser): Observable<IUser> {
    return this.http.put<IUser>(environment.ApiURL + 'createICOProfile', JSON.stringify(userData), httpOptions)
      .map(data => _.values(data));
  }

  GetAllUser() {
    return this.http.get(environment.ApiURL + 'Registrations/')
      .map(data => _.values(data));
  }

  GetSingleUser(Id): Observable<IUser> {
    return this.http.get<IUser>(environment.ApiURL + 'Registration/' + Id)
      .map(data => _.values(data));
  }

  GetInvestorWithICOs(Id): Observable<IInvestorICOs> {
    return this.http.get<IInvestorICOs>(environment.ApiURL + 'InvestorICOs/' + Id)
      .map(data => _.values(data));
  }

  GetUserEmail(email): Observable<IUser> {
    return this.http.get<IUser>(environment.ApiURL + 'getRegistrationemail?email=' + email)
      .map(data => _.values(data));
  }

  GetUserSignIn(email, password) {
    return this.http.get(environment.ApiURL + 'getUserSignIn?email=' + email + '&password=' + password)
      .map(data => _.values(data));
  }

  PutActivateUser(email, key) {
    return this.http.put(environment.ApiURL + 'putUserActivate?email=' + email + '&activatekey=' + key, httpOptions)
      .map(data => _.values(data));
  }
  DeleteUserProfile(Id) {
    return this.http.delete(environment.ApiURL + 'Registration/' + Id).toPromise();
  }
}
