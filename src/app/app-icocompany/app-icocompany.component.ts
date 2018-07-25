import { Component, OnInit } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { CompanyService } from '../services/company.service';
import { IICO } from '../core/Model/IICO';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';

@Component({
  selector: 'app-app-icocompany',
  templateUrl: './app-icocompany.component.html',
  styleUrls: ['./app-icocompany.component.css']
})
export class AppIcocompanyComponent implements OnInit  {

  forminitialization: boolean;
  imageSrc: string;
  ico: IICO;
  icoid: number;
  isLiveStreaming: boolean;

  constructor(private activateRoute: ActivatedRoute, private icoservice: CompanyService,
    private spinner: NgxSpinnerService, private alertService: AlertCenterService) {
      this.date = new Date();
      this.activateRoute.params.subscribe(params => {
        this.icoid = params['id'];
    });
  }

  date: Date;
  options: DatepickerOptions = {
    locale: enLocale
  };

  ngOnInit() {
    console.log('calling..');
    this.spinner.show();
    this.GetICO();
  }

  GetICO() {
    console.log(this.icoid);
      this.icoservice.GetICOById(this.icoid).subscribe(ICOData => {
        this.ico = ICOData[0][0];
        this.forminitialization = true;
        console.log(this.ico.iconame);
        if (this.ico.iconame !== null) {
          this.ico.icologoimage = this.AssignLogomage(this.ico.icologoimage);
          this.forminitialization = true;
        } else {
          this.forminitialization = false;
          this.alertService.alert(new Alert(AlertType.WARNING, 'There is no data for this ICO'));
        }
        this.spinner.hide();
        });
    }

    AssignLogomage(icoImage: string): string {
      if (this.IfNotEmptyNullUndefined(icoImage)) {
        return environment.ApiHostURL + 'static/companyimages/' + icoImage;
      } else {
        return '../../assets/img/icoimagecard.jpg';
      }
    }

    IfNotEmptyNullUndefined(value: string) {
      if (value !== null && value !== '' && value !== undefined) {
        return true;
      } else {
        return false;
      }
    }

}
