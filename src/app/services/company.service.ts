import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { environment } from '../../environments/environment';
import { IICO } from '../core/Model/IICO';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class CompanyService {

  constructor(private http: HttpClient) { }

  CreateICO(CompanyData: IICO): Observable<string> {
    return this.http.post<IICO>(environment.ApiURL + 'createICO', CompanyData, httpOptions)
    .map(data => _.values(data));
  }

  UpdateICO(CompanyData: IICO) {
    return this.http.put<string>(environment.ApiURL + 'updateICO', CompanyData, httpOptions)
    .map(data => _.values(data));
  }

  DeleteICO(Id) {
    return this.http.delete(environment.ApiURL + 'deleteICO/' + Id).toPromise();
  }

  GetAllICOs() {
    return this.http.get(environment.ApiURL + 'getAllICOs').toPromise()
    .then(data => _.values(data));
  }

  GetICOByName(name): Observable<IICO> {
    return this.http.get<IICO>(environment.ApiURL + 'getICO?iconame=' + name)
    .map(data => _.values(data));
  }

  GetInsertedICO(iconame, icostartdate, icoenddate, tokcenname) {
    const queryString = 'iconame=' + iconame + '&icostartdate=' + icostartdate + '&icoenddate=' + icoenddate + '&tokcenname=' + tokcenname;
    return this.http.get(environment.ApiURL + 'getInsertedICO?' + queryString)
      .map(data => _.values(data));
  }

  GetInsertedICOByName(iconame) {
    const queryString = 'iconame=' + iconame;
    return this.http.get(environment.ApiURL + 'getInsertedICOByName?' + queryString)
      .map(data => _.values(data));
  }
}
