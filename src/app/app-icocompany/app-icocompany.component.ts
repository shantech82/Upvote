import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { IICO } from '../core/Model/IICO';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { UrlparserService } from '../services/urlparser.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Urlutility } from '../Shared/urlutility';
import { Utility } from '../Shared/Utility';

@Component({
  selector: 'app-app-icocompany',
  templateUrl: './app-icocompany.component.html',
  styleUrls: ['./app-icocompany.component.css']
})

export class AppIcocompanyComponent implements OnInit {

  @ViewChild('videoPlayer') videoplayer: any;

  forminitialization: boolean;
  ico: IICO;
  name: string;
  userType: number;
  youtubeembedurl: any;
  icovideourl: any;


  constructor(private activateRoute: ActivatedRoute, private icoservice: CompanyService, private urlservice: UrlparserService,
    private spinner: NgxSpinnerService, private alertService: AlertCenterService, private router: Router,
     private sanitizer: DomSanitizer) {
    this.activateRoute.queryParams.subscribe(params => {
      this.name = params['name'];
    });
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
    this.router.navigateByUrl('/Live');
  }

  GetICO() {
    this.icoservice.GetICOByName(this.name).subscribe(ICOData => {
      this.ico = ICOData[0][0];
      if (this.ico.iconame !== null) {
        this.urlservice.GetFileURL(this.ico.icologoimage, 'icoimage').subscribe(value => {
          this.ico.icologoimage = value;
          this.forminitialization = true;
        });
        this.userType = Utility.checkCompanyUser(this.ico.userid);
        this.ico.youtubevideolink = Urlutility.GetYoutubeVideo(this.ico.youtubevideolink);
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
      } else {
        this.forminitialization = false;
        this.alertService.alert(new Alert(AlertType.WARNING, 'There is no data for this Startup'));
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
}
