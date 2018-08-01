import { Component, OnInit, Inject, AfterViewInit, ElementRef  } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { CompanyService } from '../services/company.service';
import { IICO } from '../core/Model/IICO';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { DOCUMENT } from '@angular/common';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-app-icocompany',
  templateUrl: './app-icocompany.component.html',
  styleUrls: ['./app-icocompany.component.css']
})
export class AppIcocompanyComponent implements OnInit, AfterViewInit  {

  forminitialization: boolean;
  imageSrc: string;
  ico: IICO;
  icoid: number;
  isLiveStreaming: boolean;
  companyUser: boolean;



  constructor(private activateRoute: ActivatedRoute, private icoservice: CompanyService,
    private spinner: NgxSpinnerService, private alertService: AlertCenterService,
    @Inject(DOCUMENT) private document, private elementRef: ElementRef) {
      this.activateRoute.params.subscribe(params => {
        this.icoid = params['id'];
    });
  }

  options: DatepickerOptions = {
    locale: enLocale
  };

  model: NgbDateStruct;
  date: {year: number, month: number};

  isSunday(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  ngOnInit() {
    console.log('calling..');
    this.spinner.show();
    this.GetICO();
  }

  checkCompanyUser(userid: number) {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
      if (UserData.id !== userid) {
        this.companyUser = false;
      } else {
        this.companyUser = true;
      }
    }
  }

  GetICO() {
    console.log(this.icoid);
      this.icoservice.GetICOById(this.icoid).subscribe(ICOData => {
        this.ico = ICOData[0][0];
        this.forminitialization = true;
        console.log(this.ico.iconame);
        if (this.ico.iconame !== null) {
          this.ico.icologoimage = this.AssignLogomage(this.ico.icologoimage);
          this.checkCompanyUser(this.ico.userid);
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
    startLiveStream() {
      this.isLiveStreaming = true;
    }

    ngAfterViewInit() {
      const RTCMultiConnectionScript = this.document.createElement('script');
      RTCMultiConnectionScript.type = 'text/javascript';
      RTCMultiConnectionScript.src = '../../assets/js/webrtc/RTCMultiConnection.min.js';
      this.elementRef.nativeElement.appendChild(RTCMultiConnectionScript);

      const adapterScript = this.document.createElement('script');
      adapterScript.type = 'text/javascript';
      adapterScript.src = '../../assets/js/webrtc/adapter.js';
      this.elementRef.nativeElement.appendChild(adapterScript);

      const socketScript = this.document.createElement('script');
      socketScript.type = 'text/javascript';
      socketScript.src = '../../assets/js/webrtc/socket.io.js';
      this.elementRef.nativeElement.appendChild(socketScript);

      const getHTMLMediaElementScript = this.document.createElement('script');
      getHTMLMediaElementScript.type = 'text/javascript';
      getHTMLMediaElementScript.src = '../../assets/js/webrtc/getHTMLMediaElement.js';
      this.elementRef.nativeElement.appendChild(getHTMLMediaElementScript);

      const broadcastScript = this.document.createElement('script');
      broadcastScript.type = 'text/javascript';
      broadcastScript.src = '../../assets/js/webrtc/broadcast.js';
      this.elementRef.nativeElement.appendChild(broadcastScript);

      const handlingliveScript = this.document.createElement('script');
      handlingliveScript.type = 'text/javascript';
      handlingliveScript.src = '../../assets/js/webrtc/handlinglive.js';
      this.elementRef.nativeElement.appendChild(handlingliveScript);
    }

}
