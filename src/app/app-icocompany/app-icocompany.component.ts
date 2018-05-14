import { Component, OnInit,ViewChild } from '@angular/core';
import {CompanyService} from '../services/company.service'; 
import {CompanyvideoService} from '../services/companyvideo.service'; 
import { Config } from '../app.config';
import { Url } from 'url';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import "webrtc-adapter";

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
export class AppIcocompanyComponent implements OnInit {

  constraints = { audio: false, video: true };
  @ViewChild('livevideo') livevideo: any;

  _navigator = <any> navigator;
  localStream;

  constructor(private comserv :CompanyService,private cvserv: CompanyvideoService,
    private sanitizer: DomSanitizer) { }
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
    const video = this.livevideo.nativeElement;
    this._navigator = <any>navigator;

    this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia
      || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia );
  
      this._navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
          this.localStream = stream;
          video.src = window.URL.createObjectURL(stream);
          video.play();
      });
  }

  stopStream() {
    const tracks = this.localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
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