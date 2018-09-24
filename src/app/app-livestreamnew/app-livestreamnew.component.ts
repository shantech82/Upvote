import { Component, OnInit, AfterViewInit, ElementRef, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-app-livestreamnew',
  templateUrl: './app-livestreamnew.component.html',
  styleUrls: ['./app-livestreamnew.component.css']
})
export class AppLivestreamnewComponent implements OnInit, AfterViewInit {

  userid: number;
  host: boolean;
  moderator: boolean;
  join: boolean;
  share: boolean;
  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document) { }

  ngOnInit() {
      this.userid = this.getUserId();
      console.log(this.userid);
      if (this.userid === 134 || this.userid === 67 || this.userid === 108 || this.userid === 135 || this.userid === 140 ) {
        this.host = true;
        this.moderator = false;
        this.join = true;
        this.share = true;
      } else
      if (this.userid === 63 || this.userid === 8 || this.userid === 13 || this.userid === 103) {
        this.host = true;
        this.moderator = false;
        this.join = true;
        this.share = true;
      } else
      if (this.userid === 112 || this.userid === 4 || this.userid === 102) {
        this.host = true;
        this.moderator = true;
        this.join = false;
        this.share = true;
      } else
      if (this.userid === 131 || this.userid === 144) {
        this.host = false;
        this.moderator = false;
        this.join = false;
        this.share = false;
      } else {
        this.host = true;
        this.moderator = true;
        this.join = true;
        this.share = true;
      }
  }

  getUserId() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
        return UserData.id;
    } else {
        return 0;
    }
}

  ngAfterViewInit() {
    const RTCMultiConnectionScript = this.document.createElement('script');
    RTCMultiConnectionScript.type = 'text/javascript';
    RTCMultiConnectionScript.src = '../../assets/js/webrtc/rmc3.min.js';
    this.elementRef.nativeElement.appendChild(RTCMultiConnectionScript);

    const socketScript = this.document.createElement('script');
    socketScript.type = 'text/javascript';
    socketScript.src = '../../assets/js/webrtc/socket.io.js';
    this.elementRef.nativeElement.appendChild(socketScript);

    const screenScript = this.document.createElement('script');
    screenScript.type = 'text/javascript';
    screenScript.src = '../../assets/js/webrtc/getScreenId.js';
    this.elementRef.nativeElement.appendChild(screenScript);

    const harkScript = this.document.createElement('script');
    harkScript.type = 'text/javascript';
    harkScript.src = '../../assets/js/webrtc/hark.js';
    this.elementRef.nativeElement.appendChild(harkScript);

    const fileReaderScript = this.document.createElement('script');
    fileReaderScript.type = 'text/javascript';
    fileReaderScript.src = '../../assets/js/webrtc/FileBufferReader.js';
    this.elementRef.nativeElement.appendChild(fileReaderScript);

    const getHTMLMediaElementScript = this.document.createElement('script');
    getHTMLMediaElementScript.type = 'text/javascript';
    getHTMLMediaElementScript.src = '../../assets/js/webrtc/getHTMLMediaElement.js';
    this.elementRef.nativeElement.appendChild(getHTMLMediaElementScript);

    const livestreamnewScript = this.document.createElement('script');
    livestreamnewScript.type = 'text/javascript';
    livestreamnewScript.src = '../../assets/js/webrtc/livestreamnew.js';
    this.elementRef.nativeElement.appendChild(livestreamnewScript);
  }
}
