import { Component, OnInit, AfterViewInit, ElementRef, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-app-livestreamnew',
  templateUrl: './app-livestreamnew.component.html',
  styleUrls: ['./app-livestreamnew.component.css']
})
export class AppLivestreamnewComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document) { }

  ngOnInit() {
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
