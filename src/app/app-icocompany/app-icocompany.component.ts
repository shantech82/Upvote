import { Component, OnInit, ViewChild, Inject, AfterViewInit, ElementRef  } from '@angular/core';
import {CompanyService} from '../services/company.service';
import {CompanyvideoService} from '../services/companyvideo.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ICompany } from '../core/Model/ICompany';
import { environment } from '../../environments/environment';

/* //import * as RTCMultiConnection  from '../../assets/js/webrtc/RTCMultiConnection.min.js';
//import * as adapter from '../../assets/js/webrtc/adapter.js';
//import * as socket from '../../assets/js/webrtc/socket.io.js';
//import * as getHTMLMediaElement from '../../assets/js/webrtc/getHTMLMediaElement.js';

//declare const RTCMultiConnection = new RTCMultiConnection();
//declare const adapter;
//declare const socket;
//declare const getHTMLMediaElement;

//export declare var RTCMultiConnection: any; */

export interface IVideo {
  id: number;
  video: string;
  videourl: string;
  live: string;
}



@Component({
  selector: 'app-app-icocompany',
  templateUrl: './app-icocompany.component.html',
  styleUrls: ['./app-icocompany.component.css']
})
export class AppIcocompanyComponent implements OnInit, AfterViewInit  {

  constructor(private comserv: CompanyService, private cvserv: CompanyvideoService,
    private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document, private elementRef: ElementRef) {
  }

  video: IVideo = {
    id: 0,
    video: '',
    videourl: '',
    live: '0'
  };

  liveURL: any;
  newCompanyData: ICompany;

  ngOnInit() {
    this.getCompanyInfo();
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

  getCompanyInfo() {

    const CompanyID = localStorage.getItem('CompanyId');

    /* this.comserv.(CompanyID).subscribe(companyData => {
      if (companyData !== undefined) {
        this.newCompanyData.id = companyData.id;
        this.newCompanyData.companyname = companyData.companyname;
        this.newCompanyData.email = companyData.email;
        this.newCompanyData.phonenumber = companyData.phonenumber;
        this.newCompanyData.whitepapaer = companyData.whitepapaer;
        this.newCompanyData.website = companyData.website;
        this.newCompanyData.address1 = companyData.address1;
        this.newCompanyData.address2 = companyData.address2;
        this.newCompanyData.city_id = companyData.city_id;
        this.newCompanyData.country_id = companyData.country_id;
        this.newCompanyData.zip_code = companyData.zip_code;
        this.newCompanyData.imagename = environment.ApiHostURL + 'static/companyimages/' + companyData.imagename;
        this.newCompanyData.aboutcomapny = companyData.aboutcomapny;
      }
    });
  this.cvserv.GetVidoesByCompany(CompanyID).subscribe(data => {
    if (data.vdata !== undefined) {
      console.log(data.vdata);
      data.vdata.forEach(ele => {
        if (ele.live === 'Yes') {
          // this.company.liveURL = 'https://www.youtube.com/embed/' + ele.vidoeurl;
          this.liveURL =  this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + ele.vidoeurl);
        }
      });
    }
  });*/

  }
}
