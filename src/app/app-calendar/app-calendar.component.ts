import { Component, OnInit, Input } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FileuploadService } from '../services/fileupload.service';
import { LivestreamService } from '../services/livestream.service';
import { ILiveStream, ISchedules, IliveStreamCalendar } from '../core/Model/ILiveStream';
import { Utility } from '../Shared/Utility';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { UrlparserService } from '../services/urlparser.service';
import { IICO } from '../core/Model/IICO';
import { Datetimeutility } from '../Shared/datetimeutility';
import { Icoutility } from '../Shared/icoutility';
import { Urlutility } from '../Shared/urlutility';

@Component({
  selector: 'app-app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.css']
})
export class AppCalendarComponent implements OnInit {

  @Input() ico: IICO;
  userType: number;
  forminitialization: boolean;
  scheduleform: FormGroup;
  livestreamDatas: ILiveStream[];
  schedules: Array<ISchedules> = [];
  currentlivestreammonth: string;
  todaylivestream: ILiveStream;
  livestreamcalendar: IliveStreamCalendar;
  livestream: ILiveStream;
  day: number;
  month: number;
  time: any;
  dateendstring: string;
  enddatecal: string;
  expired: string;

  constructor( private fb: FormBuilder, config: NgbDropdownConfig, private fsservice: FileuploadService,
    private livestreamService: LivestreamService, private urlservice: UrlparserService, private alertService: AlertCenterService) {

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
    this.getLiveStream();
  }

  createControls() {
    this.scheduleform = this.fb.group({
      day: ['', Validators.required],
      month: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  getLiveStream() {
    this.icoStartEndDateCalc(this.ico.icostartdate, this.ico.icoenddate);
    this.userType = Utility.checkCompanyUser(this.ico.userid);
    this.livestreamService.GetLiveStream(this.ico.id).map(data => {
      this.livestreamDatas = data[0];
      let index = 0;
      if (data[0].length > 0) {
        this.schedules = [];
        this.especialDates = [];
        data[0].map(arrayData => {
          this.schedules.push({
            'id': arrayData.id,
            'livestreamdatetime': Icoutility.livestreamdatetimeconversion(arrayData.livestreamdate, arrayData.time)
          });
          const parseDate = new Date(arrayData.livestreamdate);
          this.especialDates.push({
            'year': parseDate.getFullYear(),
            'month': parseDate.getMonth() + 1,
            'day': parseDate.getDate(),
          });
          if (index === 0) {
            this.currentlivestreammonth = parseDate.toLocaleString('en-us', { month: 'long' });
            this.startdate = {
              month: parseDate.getMonth() + 1,
              year:  parseDate.getFullYear(),
              day: 1
            };
          }
          index++;
          this.forminitialization = true;
        });
        this.todaylivestream = this.livestreamDatas[0];
      }  else {
        this.forminitialization = true;
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
        hours: Datetimeutility.getHours(this.todaylivestream.time),
        minutes: Datetimeutility.getMinutes(this.todaylivestream.time),
        location: 'UpvoteICO Livestream',
        id: this.ico.id,
      };

    if (type === 'others') {
        this.fsservice.GetLiveStreamICS(this.livestreamcalendar).subscribe(filename => {
          this.urlservice.GetFileURL(filename, 'icoimage').subscribe(value => {
            window.open(value);
          });
        });
      } else {
        window.open(Urlutility.frameCalendarURL(this.livestreamcalendar, type), '_blank');
      }
    }
  }

  ScheduleLiveStream(lviestreamDate, time) {
    this.AssignLiveStreamData(0, lviestreamDate, time, Utility.GenerateLiveStreamCode(), 'created', this.ico.userid);
    this.livestreamService.CreateLiveStream(this.livestream).subscribe(data => {
      this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your event on ' + lviestreamDate + ' Created!'));
      this.getLiveStream();
    });
  }

  AssignLiveStreamData(id, lviestreamDate, time, livestreamcode, livestreamstatus, userid) {
    this.livestream = {
      id: id,
      icosid: this.ico.id,
      livestreamdate: lviestreamDate,
      time: time,
      livestreamcode: livestreamcode,
      livestreamstatus: livestreamstatus,
      userid: userid
    };
  }

  DeleteLiveStream(event: ISchedules) {
    this.livestreamService.DeleteLiveStream(event.id).then(data => {
      this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your event on ' + event.livestreamdatetime + ' Deleted!'));
    });
  }

  AddScheduleEventClick(scheduleform: FormGroup) {
    if (scheduleform.valid) {
      const year = new Date().getFullYear();
      this.day = scheduleform.controls['day'].value;
      this.month = scheduleform.controls['month'].value;
      this.time = scheduleform.controls['time'].value;
      const newdate = Date.parse(this.month + '/' + this.day + '/' + year);
      if (!isNaN(newdate)) {
        const timeoutput = Datetimeutility.validateTime(this.time);
        if (timeoutput !== 'false') {
          const livestreamDate = new Date(year, this.month - 1, this.day,
            Datetimeutility.getHours(timeoutput), Datetimeutility.getMinutes(timeoutput));
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
    this.dateendstring = Datetimeutility.getDayString(day);
    const currentDate = Date.now();
    if (currentDate > endDate.getTime()) {
      this.expired = 'Expired';
    } else {
      const hours = Math.abs((currentDate - endDate.getTime()) / 3600000);
      this.enddatecal = Math.floor(hours / 24) + ' Days ' + (Math.floor(hours) % 24) + ' Hours Left';
    }
  }
}
