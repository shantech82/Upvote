import { Component, OnInit, AfterViewInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Urlutility } from '../Shared/urlutility';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import {
    AuthService,
    SocialUser,
  } from 'angular5-social-auth';
  import { Router } from '@angular/router';
  import { UrlparserService } from '../services/urlparser.service';

declare function startLiveStreamJs(any): any;
declare function startScreenSharing(): any;
declare function joinScreenSharing(): any;
declare function connectionClose(): any;
declare function silence(): any;
declare function onspeak(): any;
declare function onCameraStart(): any;
declare function onCameraStop(): any;


@Component({
  selector: 'app-app-livestreamnew',
  templateUrl:'./app-livestreamnew.component.html',
  styleUrls: ['./app-livestreamnew.component.css']
})
export class AppLivestreamnewComponent implements OnInit, AfterViewInit {

  userid: number;
  host: boolean;
  moderator: boolean;
  join: boolean;
  share: boolean;
  presenterName :string;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  public user: SocialUser;
  public loggedIn: boolean;
  mobileMenu: boolean;
  formintilization: boolean;

  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document, private socialAuthService: AuthService,
  private router: Router, private urlservice: UrlparserService) { }

  ngOnInit() {

    this.host = false;
    this.moderator = false;
    this.join = false;
    this.share = false;

      


    const UserData = JSON.parse(localStorage.getItem('UserData'));

    // console.log(UserData);
    this.presenterName = UserData.name;
    if (UserData != null) {
        this.user = UserData;
        this.urlservice.GetFileURL(this.user.image, 'icouser').subscribe(value => {
          this.user.image = value;
          this.formintilization = true;
        });
        this.loggedIn = true;
    } else {
      this.loggedIn = false;
      this.router.navigate(['/Login']);
    }
    this.mobileMenu = false;
  }

  public scrollToBottom(): void {
    console.log(this.directiveRef);
    console.log(this.componentRef);
    if (this.directiveRef) {
      this.directiveRef.scrollToBottom();
    } else if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }

  public onScrollEvent(event: any): void {
    if (this.directiveRef) {
      this.directiveRef.scrollToBottom();
    } else if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }

  mobileMenuShow() {
    if (this.mobileMenu === false) {
      this.mobileMenu = true;
    } else {
      this.mobileMenu = false;
    }
  }

  SignOut() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData.type === '2') {
      localStorage.removeItem('UserData');
      localStorage.removeItem('CompanyId');
      this.user = null;
      this.loggedIn = false;
      this.router.navigate(['/Login']);
      this.socialAuthService.signOut().then((signoutuser) => {
      });

    } else {
      localStorage.removeItem('UserData');
      localStorage.removeItem('CompanyId');
      this.user = null;
      this.loggedIn = false;
      this.router.navigate(['/Login']);
    }
  }



getUserImage() {
  const UserData = JSON.parse(localStorage.getItem('UserData'));
  if (UserData !== undefined && UserData !== null) {
      return UserData.image;
  } else {
      return '';
  }
}

  ngAfterViewInit() {
    console.log("in live");
    const RTCMultiConnectionScript = this.document.createElement('script');
    RTCMultiConnectionScript.type = 'text/javascript';
    RTCMultiConnectionScript.src = '../../assets/js/webrtc/rmc3.min.js';
    this.elementRef.nativeElement.appendChild(RTCMultiConnectionScript);

    const adapterScript = this.document.createElement('script');
    adapterScript.type = 'text/javascript';
    adapterScript.src = '../../assets/js/webrtc/adapter.js';
    this.elementRef.nativeElement.appendChild(adapterScript);

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

    const userImage = Urlutility.getFileURL(this.getUserImage(), 'icouser', true);
    setTimeout(() => {
      startLiveStreamJs(userImage);
    }, 5000);
  }

  openscreenshare(){
      startScreenSharing();
  }

  joinscreenshare(){
    joinScreenSharing();
  }
  ngOnDestroy(){
    connectionClose();
  }

  silence(){
    silence();
  }
  onspeak(){
    onspeak();
  }
  onCameraStart(){
    onCameraStart();
  }
  onCameraStop(){
    onCameraStop();
  }
}
