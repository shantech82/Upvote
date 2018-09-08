import { Component, OnInit, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { CompanyService } from '../services/company.service';
import { IICO } from '../core/Model/IICO';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { DOCUMENT } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Utility } from '../Shared/Utility';
import { LivestreamService } from '../services/livestream.service';
import { ILiveStream, ISchedules, IliveStreamCalendar } from '../core/Model/ILiveStream';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileuploadService } from '../services/fileupload.service';
import { UrlparserService } from '../services/urlparser.service';

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

  @ViewChild('videoPlayer') videoplayer: any;

  forminitialization: boolean;
  ico: IICO;
  name: string;
  isLiveStreaming: boolean;
  userType: number;
  dateendstring: string;
  enddatecal: string;
  expired: string;
  livestream: ILiveStream;
  livestreamDatas: ILiveStream[];
  todaylivestream: ILiveStream;
  livestreamjoined: boolean;
  schedules: Array<ISchedules> = [];
  scheduleform: FormGroup;
  day: number;
  month: number;
  time: any;
  keepdropdownopen: boolean;
  date: { year: number, month: number };
  currentlivestreammonth: string;
  youtubeembedurl: any;
  icovideourl: any;
  livestreamcalendar: IliveStreamCalendar;

  constructor(private activateRoute: ActivatedRoute, private icoservice: CompanyService, private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService, private alertService: AlertCenterService, private livestreamService: LivestreamService,
    @Inject(DOCUMENT) private document, private elementRef: ElementRef, private fb: FormBuilder, config: NgbDropdownConfig,
    private fsservice: FileuploadService, private urlservice: UrlparserService) {
    this.activateRoute.queryParams.subscribe(params => {
      this.name = params['name'];
    });

    this.createControls();

    // config.autoClose = false;
    (<any>config).autoClose = 'outside';
  }

  options: DatepickerOptions = {
    locale: enLocale
  };

  startdate: NgbDateStruct;
  especialDates: NgbDateStruct[] = [];
  myClass(date: NgbDateStruct) {
    const isSelected = this.especialDates
      .find(d => d.year === date.year && d.month === date.month && d.day === date.day);
    return isSelected ? 'classSelected' : 'classNormal';
  }

  isSunday(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0;
  }

  ngOnInit() {
    this.userType = 4;
    this.spinner.show();
    this.GetICO();
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
  startLiveStream() {
    this.AssignLiveStreamData(this.todaylivestream.id, '', '', '', 'started');
    this.livestreamService.StartStopLiveStream(this.livestream).subscribe(data => {
      this.isLiveStreaming = true;
      startLiveStreamJs();
    });
  }

  createControls() {
    this.scheduleform = this.fb.group({
      day: ['', Validators.required],
      month: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  joinLiveStream() {
    this.livestreamjoined = true;
    joinLiveStreamJs();
  }

  leaveLiveStream() {
    this.livestreamjoined = false;
    leaveLiveStreamJs();
    this.getLiveStream();
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
    this.livestreamService.GetLiveStream(this.ico.id).map(data => {
      this.livestreamDatas = data[0];
      let index = 0;
      if (data[0].length > 0) {
        this.schedules = [];
        this.especialDates = [];
        data[0].map(arrayData => {
          this.schedules.push({
            'id': arrayData.id,
            'livestreamdatetime': Utility.livestreamdatetimeconversion(arrayData.livestreamdate, arrayData.time)
          });
          const parseDate = new Date(arrayData.livestreamdate);
          this.especialDates.push({
            'year': parseDate.getFullYear(),
            'month': parseDate.getMonth() + 1,
            'day': parseDate.getDate(),
          });
          if (index === 0) {
            this.currentlivestreammonth = parseDate.toLocaleString('en-us', { month: 'long' });
          }
          index++;
          this.forminitialization = true;
        });
        this.todaylivestream = this.livestreamDatas[0];
        if (this.todaylivestream.livestreamstatus === 'started') {
          this.isLiveStreaming = true;
        }
      } else {
        this.todaylivestream = null;
      }
    }).subscribe(data => {
      this.createControls();
    });
  }

  DownloadCalendar(type: string) {
    if (this.todaylivestream) {
      this.livestreamcalendar = {
        startdate: this.todaylivestream.livestreamdate,
        title: this.ico.iconame + 'Live Stream',
        timezone: '',
        description: this.ico.iconame + 'Live Stream',
        hours: Utility.getHours(this.todaylivestream.time),
        minutes: Utility.getMinutes(this.todaylivestream.time),
        location: 'UpvoteICO Livestream',
        id: this.ico.id,
      };

    if (type === 'others') {
        this.fsservice.GetLiveStreamICS(this.livestreamcalendar).subscribe(filename => {
          const livestreamfilename = this.livestreamcalendar.title + '_event.ics';
          this.urlservice.GetFileURL(filename, 'icoimage').subscribe(value => {
            window.open(value);
          });
        });
      } else {
        window.open(Utility.frameCalendarURL(this.livestreamcalendar, type), '_blank');
      }
    }
  }

  ScheduleLiveStream(lviestreamDate, time) {
    this.AssignLiveStreamData(0, lviestreamDate, time, Utility.GenerateLiveStreamCode(), 'created');
    this.livestreamService.CreateLiveStream(this.livestream).subscribe(data => {
      this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your event on ' + lviestreamDate + ' Created!'));
      this.getLiveStream();
    });
  }

  DeleteLiveStream(event: ISchedules) {
    this.livestreamService.DeleteLiveStream(event.id).then(data => {
      this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your event on ' + event.livestreamdatetime + ' Deleted!'));
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

  AddScheduleEventClick(scheduleform: FormGroup) {
    if (scheduleform.valid) {
      const year = new Date().getFullYear();
      this.day = scheduleform.controls['day'].value;
      this.month = scheduleform.controls['month'].value;
      this.time = scheduleform.controls['time'].value;
      const newdate = Date.parse(this.month + '/' + this.day + '/' + year);
      if (!isNaN(newdate)) {
        const timeoutput = Utility.validateTime(this.time);
        if (timeoutput !== 'false') {
          const livestreamDate = new Date(year, this.month - 1, this.day, Utility.getHours(timeoutput), Utility.getMinutes(timeoutput));
          // this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your event on ' + livestreamDate + ' Created!'));
          this.ScheduleLiveStream(livestreamDate, this.time);
          this.getLiveStream();
        } else {
          this.alertService.alert(new Alert(AlertType.WARNING, Utility.timemessage));
        }
      } else {
        this.alertService.alert(new Alert(AlertType.WARNING, 'Your date is invalid, please check your event date: ' + newdate));
      }
    } else {
      this.alertService.alert(new Alert(AlertType.WARNING, 'Your input date and time is invalid'));
    }
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
    this.icoservice.GetICOByName(this.name).subscribe(ICOData => {
      this.ico = ICOData[0][0];
      this.forminitialization = true;
      if (this.ico.iconame !== null) {
        this.urlservice.GetFileURL(this.ico.icologoimage, 'icoimage').subscribe(value => {
          this.ico.icologoimage = value;
        });
        this.checkCompanyUser(this.ico.userid);
        this.icoStartEndDateCalc(this.ico.icostartdate, this.ico.icoenddate);
        this.ico.youtubevideolink = Utility.GetYoutubeVideo(this.ico.youtubevideolink);
        if (this.ico.youtubevideolink !== undefined) {
          this.UrlSanitizer(true);
        } else {
          this.urlservice.GetFileURL(this.ico.videouploadurl, 'icovidoe').subscribe(value => {
            this.ico.videouploadurl = value;
            if (this.ico.videouploadurl !== undefined) {
              this.UrlSanitizer(false);
            }
          });
        }
        this.getLiveStream();
      } else {
        this.forminitialization = false;
        this.alertService.alert(new Alert(AlertType.WARNING, 'There is no data for this ICO'));
      }
      this.spinner.hide();
    });
  }

  UrlSanitizer(type: boolean) {
    if (type) {
      this.youtubeembedurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ico.youtubevideolink.replace('watch?v=', 'embed/'));
    } else {
      this.icovideourl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ico.videouploadurl);
    }
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
  }
}
