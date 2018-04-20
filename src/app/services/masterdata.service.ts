import { Injectable } from '@angular/core';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/map';  
import 'rxjs/add/operator/do'; 

@Injectable()
export class MasterDataService {

  constructor(private http: Http) { }

  GetCities(cityname){       
    return this.http.get('http://localhost:3000/api/getCities?city=' + cityname)  
            .map((response: Response) => response.json())              
  } 

  GetStates(stateid){       
    return this.http.get('http://localhost:3000/api/getstates?stateid=' + stateid)  
            .map((response: Response) => response.json())              
  } 

  GetCountries(countryid){       
    return this.http.get('http://localhost:3000/api/getcounties?countryid=' + countryid)  
            .map((response: Response) => response.json())              
  } 
  GetStateCountries(cityid){       
    return this.http.get('http://localhost:3000/api/getStateCountry?cityid=' + cityid)  
            .map((response: Response) => response.json())              
  } 
}
