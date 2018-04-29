import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 
import { ApiService } from './ServiceConfig';

@Injectable()
export class MasterDataService {

  constructor(private http: Http) { }

  GetCities(cityname){       
    return this.http.get(ApiService.URL + 'getCities?city=' + cityname)  
            .map((response: Response) => response.json())              
  } 

  GetStates(stateid){       
    return this.http.get(ApiService.URL + 'getstates?stateid=' + stateid)  
            .map((response: Response) => response.json())              
  } 

  GetCountries(countryid){       
    return this.http.get(ApiService.URL + 'getcounties?countryid=' + countryid)  
            .map((response: Response) => response.json())              
  } 
  GetStateCountries(cityid){       
    return this.http.get(ApiService.URL + 'getStateCountry?cityid=' + cityid)  
            .map((response: Response) => response.json())              
  } 
}
