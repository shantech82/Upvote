import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';

@Injectable()
export class MasterDataService {

  constructor(private http: HttpClient) { }

  GetCities(cityname) {
    return this.http.get(environment.ApiURL + 'getCities?city=' + cityname)
    .map(data => _.values(data));
  }

  GetStates(stateid) {
    return this.http.get(environment.ApiURL + 'getstates?stateid=' + stateid)
    .map(data => _.values(data));
  }

  GetCountries(countryid) {
    return this.http.get(environment.ApiURL + 'getcounties?countryid=' + countryid)
    .map(data => _.values(data));
  }
  GetNoOfInvestments() {
    return this.http.get(environment.ApiURL + 'getNoOfInvestment')
    .map(data => _.values(data));
  }
  GetICOCategory() {
    return this.http.get(environment.ApiURL + 'getICOCategory')
    .map(data => _.values(data));
  }
  GetStateCountries(cityid) {
    return this.http.get(environment.ApiURL + 'getStateCountry?cityid=' + cityid)
    .map(data => _.values(data));
  }
}
