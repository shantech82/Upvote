import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { MasterDataService } from '../services/masterdata.service';
import { FileuploadService } from '../services/fileupload.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { ICompany } from '../core/Model/ICompany';

export interface IState {
  id: number;
  name: string;
}

export interface ICountry {
  id: number;
  name: string;
}

export interface ICity {
  id: number;
  name: string;
}


@Component({
  selector: 'app-app-company',
  templateUrl: './app-company.component.html',
  styleUrls: ['./app-company.component.css']
})

export class AppCompanyComponent {

  public searchStr: string;
  public dataService: CompleterData;
  private cityData = [];
  private previousecityvalue: string;
  private cityValue: string;
  filesToUpload: File = null;
  fileToDisplay: any = null;

  companyform: FormGroup;
  companyname: string;
  email: string;
  whitepaper: string;
  website: string;
  aboutcompany: string;
  phonenumber: string;
  addressline1: string;
  addressline2: string;
  city: ICity = { id: 0, name: '' };
  state: IState = { id: 0, name: '' };
  country: ICountry = { id: 0, name: '' };
  postcode: string;

  newCompanyData: ICompany;

  constructor(private fb: FormBuilder, private comserv: CompanyService, private completerService: CompleterService, private router: Router,
    private mdservice: MasterDataService, private fuservice: FileuploadService) {
    this.companyform = this.fb.group({
      companyname: ['', Validators.required],
      email: ['', [Validators.required, this.isEmailValid('email')]],
      aboutcompany: ['', [Validators.required, Validators.minLength(100)]],
      addressline1: ['', Validators.required],
      city: ['', Validators.required],
      state: [{ value: '', disabled: true }, Validators.required],
      country: [{ value: '', disabled: true }, Validators.required],
      postcode: ['', Validators.required],
      whitepaper: ['', [this.isWebsiteValid('whitepaper')]],
      website: ['', [this.isWebsiteValid('website')]],
      phonenumber: ['', [Validators.nullValidator, Validators.minLength(8),
      Validators.maxLength(13), this.isPhoneNumberValid('phonenumber')]],
      addressline2: ['', Validators.nullValidator]
    });

    this.dataService = this.completerService.local(this.cityData, 'cityname', 'cityname');
  }

  isEmailValid(control) {
    return value => {
      const regex = new RegExp(['/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}',
        '\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;'].join(''));
      return regex.test(control.value) ? null : { invalidEmail: true };
    };
  }

  isWebsiteValid(control) {
    return value => {
      const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      return regex.test(control.value) || control.value === '' ? null : { invalidWebSite: true };
    };
  }

  isPhoneNumberValid(control) {
    return value => {
      const regex = /^[0-9]*$/;
      return regex.test(control.value) || control.value === '' ? null : { invalidPhone: true };
    };
  }

  upload() {
    const formData: any = new FormData();
    formData.append('file', this.filesToUpload, this.filesToUpload.name);
    this.fuservice.UploadCompanyImage(formData).subscribe(data => {
      return data;
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files[0];
  }


  City_onKeyPrss(event) {
    this.cityValue = event.target.value;
    if (this.cityValue.length > 0 && !this.cityValue.startsWith(this.previousecityvalue)) {
      this.mdservice.GetCities(event.target.value + '%').subscribe(data => {
        if (data !== undefined && data.data !== undefined && data.data.length > 0) {
          this.cityData = [];
          data.data.forEach(ele => {
            this.cityData.push({ id: ele.id, citystatename: ele.cityname + '-' + ele.statename, cityname: ele.cityname });
          });
        }
        this.dataService = this.completerService.local(this.cityData, 'cityname', 'citystatename');
      });
      this.previousecityvalue = event.target.value;
    }
    if (this.cityValue.length <= 0) {
      this.cityData = [];
      this.dataService = this.completerService.local(this.cityData, 'cityname', 'cityname');
    }
  }

  City_OnSelected(selected: CompleterItem) {
    if (selected) {
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

  CCompany(companyform: FormGroup) {
    if (companyform.valid) {
      // gettting userid
      let userid;
      const UserData = JSON.parse(localStorage.getItem('UserData'));
      if (UserData != null) {
        userid = UserData.id;
        // checking company name existing or not
        const nameofcompany = companyform.controls['companyname'].value;
        const emailofcompany = companyform.controls['email'].value;
        this.comserv.GetCompanyByName(nameofcompany, emailofcompany).subscribe(data => {
          if (data !== undefined) {
            alert('comapny details already exist');
          } else {
            // uploading compnayimage
            const formData: any = new FormData();
            const modifiedfilename = nameofcompany + Date.now() + this.filesToUpload.name;
            formData.append('file', this.filesToUpload, modifiedfilename);
            this.fuservice.UploadCompanyImage(formData).subscribe(filename => {
              this.newCompanyData = {
                companyname: nameofcompany,
                email: emailofcompany,
                whitepapaer: companyform.controls['whitepaper'].value,
                website: companyform.controls['website'].value,
                aboutcomapny: companyform.controls['aboutcompany'].value,
                phonenumber: companyform.controls['phonenumber'].value,
                address1: companyform.controls['addressline1'].value,
                address2: companyform.controls['addressline2'].value,
                city_id: this.city.id,
                country_id: this.country.id,
                zip_code: companyform.controls['postcode'].value,
                userid: userid,
                imagename: filename,
                id: 0
              };
              this.comserv.CreateCompany(this.newCompanyData).subscribe(returnValue => {
                if (returnValue !== undefined) {
                  const key = 'CompanyId';
                  localStorage.setItem(key, returnValue.id.toString());
                  alert('comapny details inserted');
                  this.router.navigate(['/Company']);
                } else {
                  alert('something went wrong');
                }
              });
            });
          }
        });
      } else {
        alert('user not found');
      }
    } else {
      alert('given details are not valid');
    }
  }

}
