import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { IICOList } from '../core/Model/IICOList';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Utility } from '../Shared/Utility';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlparserService } from '../services/urlparser.service';

@Component({
  selector: 'app-app-companylist',
  templateUrl: './app-companylist.component.html',
  styleUrls: ['./app-companylist.component.css']
})
export class AppCompanylistComponent implements OnInit {

  @ViewChild('videoPlayer') videoplayer: any;

  config: any = {
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 30,
    slidesPerView: 4,
    slidesPerGroup: 4,
    loops: false,
    breakpoints: {
      // when window width is <= 320px
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10
      },
      // when window width is <= 480px
      480: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 20
      },
      // when window width is <= 640px
      640: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 30
      },
      // when window width is <= 1024px
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 30
      }
    }
  };

  icolist: IICOList[];
  forminitialization: boolean;
  page: string;
  topicolist: IICOList;
  isICOAvailable: boolean;
  isLivestreaming: boolean;
  displayText: string;
  youtubeembedurl: any;
  icovideourl: any;

  constructor(private icoservice: CompanyService, private spinner: NgxSpinnerService, private sanitizer: DomSanitizer,
    private router: Router, private urlservice: UrlparserService) { }

  ngOnInit() {
    this.spinner.show();
    this.GetUAllICOs();
    this.page = 'ico';
    this.displayText = 'All ICOs';
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  GetUAllICOs() {
    this.icoservice.GetAllICOs().then(userICOsData => {
      if (userICOsData[0].length > 0) {
        const investorICO = userICOsData[0];
        this.AssignICOData(investorICO);
        this.topicolist = this.livestreamstartedICOs(this.icolist);
        this.setVidoeURL();
        this.ICOSorting();
        if (this.icolist[0].iconame !== null) {
          this.isICOAvailable = true;
        } else {
          this.isICOAvailable = false;
        }
      } else {
        this.isICOAvailable = false;
      }
      this.AssignImageURL();
      this.spinner.hide();
    });
  }

  setVidoeURL() {
    this.topicolist.youtubevideolink = Utility.GetYoutubeVideo(this.topicolist.youtubevideolink);
    if (this.topicolist.youtubevideolink !== undefined) {
      this.UrlSanitizer(true);
    } else {
      this.urlservice.GetFileURL(this.topicolist.videouploadurl, 'icovideo').subscribe(value => {
        this.topicolist.videouploadurl = value;
        if (this.topicolist.videouploadurl !== undefined) {
          this.UrlSanitizer(false);
        }
      });
    }
  }

  UrlSanitizer(type: boolean) {
    if (type) {
      this.youtubeembedurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.topicolist.youtubevideolink.replace('watch?v=', 'embed/'));
    } else {
      this.icovideourl = this.sanitizer.bypassSecurityTrustResourceUrl(this.topicolist.videouploadurl);
    }
  }

  ICOSorting() {
    const icowithlivesteam: IICOList[] = Utility.ICOSorting(this.icolist.filter(ico => ico.livestreamdate !== undefined), true);
    const icowithoutlivestream: IICOList[] = Utility.ICOSorting(this.icolist.filter(ico => ico.livestreamdate === undefined), true);

    this.icolist = [];
    this.icolist.push.apply(this.icolist, icowithlivesteam);
    this.icolist.push.apply(this.icolist, icowithoutlivestream);
  }

  livestreamstartedICOs(icoslist: IICOList[]) {
    let livestreamico = icoslist.find(ico => ico.livestreamstatus === 'started');
    if (livestreamico === undefined) {
      livestreamico = icoslist[0];
    } else {
      this.isLivestreaming = true;
    }
    return livestreamico;
  }

  AssignICOData(apiICOData: any) {
    this.icolist = apiICOData.map(o => {
      return {
        iconame: o.iconame,
        icologoimage: o.icologoimage,
        icoshortdescription: o.icoshortdescription,
        icocreatedon: o.createdon,
        icolivestreamData: Utility.getDiferenceInDays(o.icolivestreamdata),
        iswhitelistjoined: o.iswhitelistjoined,
        id: o.id,
        livestreamstatus: o.livestreamstatus,
        livestreamdate: o.icolivestreamdata ? new Date(o.icolivestreamdata) : undefined,
        videouploadurl: o.videouploadurl,
        youtubevideolink: o.youtubevideolink
      };
    });
  }

  AssignImageURL() {
    const count = this.icolist.length;
    let index = 1;
    this.icolist.map(o => {
      this.urlservice.GetFileURL(o.icologoimage, 'icoimage').subscribe(value => {
        o.icologoimage = value;
        index++;
        if (index > count) {
          this.forminitialization = true;
        }
      });
    });
  }
}
