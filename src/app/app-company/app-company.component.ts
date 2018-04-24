import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,FormBuilder,Validators,NgForm,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import {CompanyService} from '../services/company.service'; 
import {MasterDataService} from '../services/masterdata.service';
import {FileuploadService} from '../services/fileupload.service';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { ThrowStmt } from '@angular/compiler';
import { CompleterService, CompleterData,CompleterItem } from 'ng2-completer';
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 

export interface IState{
  id:number,
  name:string
}

export interface ICountry{
  id:number,
  name:string
}

export interface ICity{
  id:number,
  name:string
}


@Component({
  selector: 'app-app-company',
  templateUrl: './app-company.component.html',
  styleUrls: ['./app-company.component.css']
})

export class AppCompanyComponent {

  protected searchStr: string;
  protected dataService: CompleterData;
  protected cityData = [];
  private previousecityvalue:string;
  private cityValue: string;
  filesToUpload: File = null;
  fileToDisplay: any = null;
  
  companyform:FormGroup;
  companyname:string="";
  email:string="";
  whitepaper:string="";
  website:string="";
  aboutcompany:string="";
  phonenumber:string="";
  addressline1:string="";
  addressline2:string="";
  city:ICity = {id:0,name:""};
  state:IState = {id:0,name:""};
  country:ICountry = {id:0,name:""};
  postcode:string="";

  constructor(private fb: FormBuilder,private comserv :CompanyService,private completerService: CompleterService,
  private mdservice: MasterDataService,private fuservice: FileuploadService,private http: Http) {
      this.companyform = this.fb.group({
        companyname: ['', Validators.required],
        email: ['', [Validators.required,this.isEmailValid('email')]],
        aboutcompany: ['', [Validators.required,Validators.minLength(6)]],
        addressline1: ['', Validators.required],
        city: ['', Validators.required],
        state: [{value:'',disabled:true}, Validators.required],
        country: [{value:'',disabled:true}, Validators.required],
        postcode: ['', Validators.required],
        whitepaper:['',Validators.nullValidator],
        website:['',Validators.nullValidator],
        phonenumber:['',Validators.nullValidator],
        addressline2:['',Validators.nullValidator]
      });

      this.dataService = this.completerService.local(this.cityData, 'cityname', 'cityname');
    }

    isEmailValid(control) {
      return control => {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regex.test(control.value) ? null : { invalidEmail: true };
      }
    }

  ngOnInit() {
      //this.fuservice.GetCompanyImage('IMG_0025.jpg').subscribe(data => {
      //this.fileToDisplay = data;
    //})
  }

  upload() {
    const formData: any = new FormData();
    formData.append('file',this.filesToUpload,this.filesToUpload.name);
    this.fuservice.UploadCompanyImage(formData);
}

fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files[0];
}

  
  City_onKeyPrss(event){
    this.cityValue = event.target.value;
    if(this.cityValue.length > 0 && !this.cityValue.startsWith(this.previousecityvalue)){
      this.mdservice.GetCities(event.target.value + '%').subscribe(data => {
        if(data != undefined && data.data != undefined && data.data.length > 0)
        {
          this.cityData = [];
            data.data.forEach(ele => {
              this.cityData.push({id: ele.id, citystatename: ele.cityname + '-' + ele.statename,cityname: ele.cityname});
            });
        }
        this.dataService = this.completerService.local(this.cityData, 'cityname', 'citystatename');
      })
      this.previousecityvalue = event.target.value;
    }
    if(this.cityValue.length <= 0)
    {
      this.cityData = [];
      this.dataService = this.completerService.local(this.cityData, 'cityname', 'cityname');
    }
  }

  City_OnSelected(selected:CompleterItem){
    if(selected){
    this.mdservice.GetStateCountries(selected.originalObject.id).subscribe(data => {
        this.state.id = data.data[0].stateid;
        this.state.name = data.data[0].statename;
        this.country.id = data.data[0].countryid;
        this.country.name = data.data[0].countryname;
        this.city.id = selected.originalObject.id;
        this.city.name = selected.originalObject.title;
    });
   }
  }

  CCompany(companyform:NgForm){
    if(companyform.valid){
      let companydata = {
        companyname: companyform.controls['companyname'].value,
        email: companyform.controls['email'].value,
        whitepapaer: companyform.controls['whitepaper'].value,
        website: companyform.controls['website'].value,
        aboutcomapny: companyform.controls['aboutcompany'].value,
        phonenumber: companyform.controls['phonenumber'].value,
        address1: companyform.controls['addressline1'].value,
        address2: companyform.controls['addressline2'].value,
        city_id: this.city.id,
        state_id: this.state.id,
        country_id: this.country.id,
        zip_code: companyform.controls['postcode'].value,
      }
      this.comserv.GetCompanyByName(companydata.companyname,companydata.email).subscribe(data => {
        if(data.companydata != undefined){
          alert("comapny details already exist");
        }
        else{
          this.comserv.CreateCompany(companydata).subscribe(data => {
            if(data.companydata != undefined){
              alert("comapny details inserted");
            }
            else{
              alert('something went wrong')
            }
          })
        }
      });
      }
      else{
        alert("given details are not valid")
      }
  }

}
