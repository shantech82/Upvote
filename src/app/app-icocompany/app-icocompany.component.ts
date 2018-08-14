import { Component, OnInit, Inject, AfterViewInit, ElementRef } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { CompanyService } from '../services/company.service';
import { IICO } from '../core/Model/IICO';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { DOCUMENT } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Utility } from '../Shared/Utility';
import { LivestreamService } from '../services/livestream.service';
import { ILiveStream } from '../core/Model/LiveStream';

declare function startLiveStreamJs(): any;
declare function stopLiveStreamJs(): any;
declare function joinLiveStreamJs(): any;
declare function leaveLiveStreamJs(): any;

@Component({
  selector: 'app-app-icocompany',
  templateUrl: './app-icocompany.component.html',
  styleUrls: ['./app-icocompany.component.css']
})

export class AppIcocompanyComponent implements OnInit, AfterViewInit {

  forminitialization: boolean;
  imageSrc: string;
  ico: IICO;
  icoid: number;
  isLiveStreaming: boolean;
  userType: number;
  dateendstring: string;
  enddatecal: string;
  expired: string;
  livestream: ILiveStream;
  livestreamDatas: ILiveStream[];
  todaylivestream: ILiveStream;
  livestreamjoined: boolean;

  constructor(private activateRoute: ActivatedRoute, private icoservice: CompanyService,
    private spinner: NgxSpinnerService, private alertService: AlertCenterService, private livestreamService: LivestreamService,
    @Inject(DOCUMENT) private document, private elementRef: ElementRef) {
    this.activateRoute.params.subscribe(params => {
      this.icoid = params['id'];
    });
  }

  options: DatepickerOptions = {
    locale: enLocale
  };

  livestreamdates: NgbDateStruct;
  date: { year: number, month: number };

  isSunday(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  ngOnInit() {
    this.userType = 4;
    this.spinner.show();
    this.GetICO();
  }

  startLiveStream() {
    this.AssignLiveStreamData(this.todaylivestream.id, '', '', '', 'started');
    this.livestreamService.StartStopLiveStream(this.livestream).subscribe(data => {
      this.isLiveStreaming = true;
      startLiveStreamJs();
    });
  }

  joinLiveStream() {
    this.livestreamjoined = true;
    joinLiveStreamJs();
  }

  leaveLiveStream() {
    this.livestreamjoined = false;
    leaveLiveStreamJs();
    this.todaylivestream = null;
  }

  stopLiveStream() {
    this.AssignLiveStreamData(this.todaylivestream.id, '', '', '', 'completed');
    this.livestreamService.StartStopLiveStream(this.livestream).subscribe(data => {
      this.isLiveStreaming = false;
      stopLiveStreamJs();
    });
    this.todaylivestream = null;
  }

  getLiveStream() {
    this.livestreamService.GetLiveStream(this.icoid).then(livestreamdata => {
      this.livestreamDatas = livestreamdata[0];
      if (this.livestreamDatas.length > 0) {
        this.todaylivestream = this.livestreamDatas[0];
        if (this.todaylivestream.livestreamstatus === 'started') {
          this.isLiveStreaming = true;
        }
      }
    });
    console.log(this.todaylivestream);
  }

  ScheduleLiveStream(lviestreamDate, time) {
    this.AssignLiveStreamData(0, lviestreamDate, time, Utility.GenerateLiveStreamCode(), 'created');
    this.livestreamService.CreateLiveStream(this.livestream).subscribe(data => {
      this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your event on ' + lviestreamDate + ' Created!'));
    });
  }

  DeleteLiveStream(id, lviestreamDate) {
    this.livestreamService.DeleteLiveStream(id).then(data => {
      this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your event on ' + lviestreamDate + ' Deleted!'));
    });
  }

  AssignLiveStreamData(id, lviestreamDate, time, livestreamcode, livestreamstatus) {
    this.livestream = {
      id: id,
      icosid: this.ico.id,
      livestreamdate: lviestreamDate,
      time: time,
      livestreamcode: livestreamcode,
      livestreamstatus: livestreamstatus
    };
  }

  AddScheduleEventClick() {
    const day = 11;
    const month = 10;
    const time = '13:00';
    const year = new Date().getFullYear();
    const livestreamDate = new Date(day, month, year);
    this.ScheduleLiveStream(livestreamDate, time);
  }

  icoStartEndDateCalc(icostartdate: Date, icoenddate: Date) {
    const startDate = new Date(icostartdate);
    const endDate = new Date(icoenddate);
    const day = startDate.getDate();
    this.dateendstring = Utility.getDayString(day);
    const currentDate = Date.now();
    if (currentDate > endDate.getTime()) {
      this.expired = 'Expired';
    } else {
      const hours = Math.abs((currentDate - endDate.getTime()) / 3600000);
      this.enddatecal = Math.floor(hours / 24) + ' Days ' + (Math.floor(hours) % 24) + ' Hours Left';
    }
  }

  selectToday() {
    const date = new Date();
    this.livestreamdates = { day: date.getUTCDay(), month: date.getUTCMonth(), year: date.getUTCFullYear() };
  }


  checkCompanyUser(userid: number) {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
      if (UserData.id !== userid) {
        this.userType = 0;
      } else {
        this.userType = 1;
      }
      if (UserData.ismoderator) {
        this.userType = 2;
      }
    }
  }

  GetICO() {
    this.icoservice.GetICOById(this.icoid).subscribe(ICOData => {
      this.ico = ICOData[0][0];
      this.forminitialization = true;
      if (this.ico.iconame !== null) {
        this.ico.icologoimage = Utility.getImageURL(this.ico.icologoimage);
        this.checkCompanyUser(this.ico.userid);
        this.icoStartEndDateCalc(this.ico.icostartdate, this.ico.icoenddate);
        this.selectToday();
        this.getLiveStream();
        this.forminitialization = true;
      } else {
        this.forminitialization = false;
        this.alertService.alert(new Alert(AlertType.WARNING, 'There is no data for this ICO'));
      }
      this.spinner.hide();
    });
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

    /* const handlingliveScript = this.document.createElement('script');
    handlingliveScript.type = 'text/javascript';
    handlingliveScript.src = '../../assets/js/webrtc/handlinglive.js';
    this.elementRef.nativeElement.appendChild(handlingliveScript); */
  }

}
