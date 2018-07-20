import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { ICompany } from '../core/Model/ICompany';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class CompanyService {

  constructor(private http: HttpClient) { }

  CreateCompany(CompanyData: ICompany): Observable<ICompany> {
    return this.http.post<ICompany>(environment.ApiURL + 'createCompany', CompanyData, httpOptions)
    .map(data => _.values(data));
  }

  GetAllICOs() {
    return this.http.get(environment.ApiURL + 'getAllICOs').toPromise()
    .then(data => _.values(data));
  }

  GetCompanyById(Id): Observable<ICompany> {
    return this.http.get<ICompany>(environment.ApiURL + 'getCompanybyID/' + Id)
    .map(data => _.values(data));
  }

  GetCompanyByUserId(Id) {
    return this.http.get(environment.ApiURL + 'getCompanyIDByUser/' + Id)
    .map(data => _.values(data));
  }

  GetCompanyByName(companyname, email) {
    return this.http.get(environment.ApiURL + 'getCompanybyName?companyname=' + companyname + '&&email=' + email)
    .map(data => _.values(data));
  }
}
