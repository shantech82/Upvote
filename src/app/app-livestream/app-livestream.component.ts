import { Component, OnInit, AfterViewInit, ElementRef, Inject, Input } from '@angular/core';
import { ILiveStream } from '../core/Model/ILiveStream';
import { LivestreamService } from '../services/livestream.service';
import { DOCUMENT } from '@angular/common';
import { Utility } from '../Shared/Utility';

declare function startLiveStreamJs(): any;
declare function stopLiveStreamJs(): any;
declare function joinLiveStreamJs(): any;
declare function leaveLiveStreamJs(): any;

@Component({
  selector: 'app-app-livestream',
  templateUrl: './app-livestream.component.html',
  styleUrls: ['./app-livestream.component.css']
})
export class AppLivestreamComponent implements OnInit, AfterViewInit {

  @Input() icoid: number;
  @Input() userid: number;
  userType: number;
  todaylivestream: ILiveStream;
  isLiveStreaming: boolean;
  livestreamjoined: boolean;
  livestream: ILiveStream;
  forminitialization: boolean;
  livestreamDatas: ILiveStream[];

  constructor(private livestreamService: LivestreamService, private elementRef: ElementRef,
    @Inject(DOCUMENT) private document) {
  }

  ngOnInit() {
    this.getLiveStream();
  }

  AssignLiveStreamData(id, icosid, lviestreamDate, time, livestreamcode, livestreamstatus, userid) {
    this.livestream = {
      id: id,
      icosid: icosid,
      livestreamdate: lviestreamDate,
      time: time,
      livestreamcode: livestreamcode,
      livestreamstatus: livestreamstatus,
      userid: userid
    };
  }

  startLiveStream() {
    this.AssignLiveStreamData(this.todaylivestream.id, this.icoid, '', '', '', 'started', this.userid);
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
  }

  createlivestream() {
    this.livestreamService.deleteLiveStreamSystemCreated(this.icoid).subscribe(() => {
      this.AssignLiveStreamData(0, this.icoid, new Date(), '22:00', Utility.GenerateLiveStreamCode(), 'created', 'system');
      this.livestreamService.CreateLiveStream(this.livestream).subscribe(() => {
          this.getLiveStream();
      });
    });
  }

  stopLiveStream() {
    this.AssignLiveStreamData(this.todaylivestream.id, this.icoid, '', '', '', 'completed', this.userid);
    this.livestreamService.StartStopLiveStream(this.livestream).subscribe(data => {
      this.isLiveStreaming = false;
      stopLiveStreamJs();
    });
    this.todaylivestream = null;
  }

  getLiveStream() {
    this.userType = Utility.checkCompanyUser(this.userid);
    this.livestreamService.GetLiveStream(this.icoid).subscribe(data => {
      this.livestreamDatas = data[0];
      if (this.livestreamDatas.length > 0) {
        this.todaylivestream = this.livestreamDatas[0];
         if (this.todaylivestream.livestreamstatus === 'started') {
          this.isLiveStreaming = true;
          this.forminitialization = true;
        }
      }  else {
        if (this.userType === 1) {
          this.createlivestream();
        } else {
          this.todaylivestream = null;
        }
        this.forminitialization = true;
      }
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
  }

}
