import { Component, OnInit,ViewChild,Inject, AfterViewInit, ElementRef  } from '@angular/core';
import {CompanyService} from '../services/company.service'; 
import {CompanyvideoService} from '../services/companyvideo.service'; 
import { Config } from '../app.config';
import { Url } from 'url';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

//import * as RTCMultiConnection  from '../../assets/js/webrtc/RTCMultiConnection.min.js';
//import * as adapter from '../../assets/js/webrtc/adapter.js';
//import * as socket from '../../assets/js/webrtc/socket.io.js';
//import * as getHTMLMediaElement from '../../assets/js/webrtc/getHTMLMediaElement.js';

//declare const RTCMultiConnection = new RTCMultiConnection();
//declare const adapter; 
//declare const socket; 
//declare const getHTMLMediaElement; 

//export declare var RTCMultiConnection: any;

export interface ICompany{
  id:number,
  companyname:string,
  email:string,
  phonenumber:string,
  whitepaper:string,
  website:string,
  address1:string,
  address2:string,
  city:string,
  state:string,
  country:string,
  postalcode:string,
  imageUrl:string,
  aboutcomapny:string,
  liveURL:string;
}

export interface IVideo{
  id:number,
  video:string,
  videourl:string,
  live:string
}

@Component({
  selector: 'app-app-icocompany',
  templateUrl: './app-icocompany.component.html',
  styleUrls: ['./app-icocompany.component.css']
})
export class AppIcocompanyComponent implements OnInit,AfterViewInit  {

  constructor(private comserv :CompanyService,private cvserv: CompanyvideoService,
    private sanitizer: DomSanitizer,@Inject(DOCUMENT) private document, private elementRef: ElementRef) { 
  }

  company: ICompany = {
    id:0,
    companyname:"",
    email:"",
    phonenumber:"",
    whitepaper:"",
    website:"",
    address1:"",
    address2:"",
    city:"",
    state:"",
    country:"",
    postalcode:"",
    imageUrl:"",
    aboutcomapny:"",
    liveURL:""
  };

  video: IVideo ={
    id:0,
    video:"",
    videourl:"",
    live:"0"
  }

  liveURL:any;


  ngOnInit() {
    this.getCompanyInfo()
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

  getCompanyInfo(){
    
    let CompanyID = localStorage.getItem('CompanyId');

    this.comserv.GetCompanyById(CompanyID).subscribe(data => {
      if(data.data != undefined){
        this.company.id = data.data.id;
        this.company.companyname = data.data.companyname;
        this.company.email = data.data.email;
        this.company.phonenumber = data.data.phonenumber;
        this.company.whitepaper = data.data.whitepapaer;
        this.company.website = data.data.website;
        this.company.address1 = data.data.address1;
        this.company.address2 = data.data.address2;
        this.company.city = data.data.cityname;
        this.company.state = data.data.statename;
        this.company.country = data.data.countryname;
        this.company.postalcode = data.data.zip_code;
        this.company.imageUrl = Config.ApiHostURL + "static/companyimages/" + data.data.imagename;
        this.company.aboutcomapny = data.data.aboutcomapny;
      }
    });
  this.cvserv.GetVidoesByCompany(CompanyID).subscribe(data => {
    if(data.vdata != undefined){
      console.log(data.vdata);
      data.vdata.forEach(ele => {
        if(ele.live == 'Yes'){
          //this.company.liveURL = 'https://www.youtube.com/embed/' + ele.vidoeurl;
          this.liveURL =  this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + ele.vidoeurl);
        }
      });
    }
  })
 
  }
}