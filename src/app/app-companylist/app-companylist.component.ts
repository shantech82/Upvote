import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { IICOList } from '../core/Model/IICOList';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Utility } from '../Shared/Utility';

@Component({
  selector: 'app-app-companylist',
  templateUrl: './app-companylist.component.html',
  styleUrls: ['./app-companylist.component.css']
})
export class AppCompanylistComponent implements OnInit {

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

  constructor(private icoservice: CompanyService, private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit() {
    this.spinner.show();
    this.GetUAllICOs();
    this.page = 'ico';
  }

  GetUAllICOs() {
    this.icoservice.GetAllICOs().then(userICOsData => {
      if (userICOsData[0].length > 0) {
        const investorICO = userICOsData[0];
        this.AssignICOData(investorICO);
        this.topicolist = this.livestreamstartedICOs(this.icolist);
        this.ICOSoring();
        this.forminitialization = true;
        if (this.icolist[0].iconame !== null) {
          this.isICOAvailable = true;
        } else {
          this.isICOAvailable = false;
        }
      } else {
        this.isICOAvailable = false;
      }
      this.spinner.hide();
    });
  }

  ICOSoring() {
    const icowithlivesteam: any = this.icolist.filter(ico => ico.livestreamdate !== undefined);

    const icowithoutlivestream: any = this.icolist.filter(ico => ico.livestreamdate === undefined);

    this.icolist = [];
    icowithlivesteam.sort(function (a, b) {
      const dateA: any = new Date(a.livestreamdate), dateB: any = new Date(b.livestreamdate);
      return dateA - dateB;
    });
    icowithlivesteam.map(data => {
      if (this.icolist.length > 0) {
        const pushdata = this.icolist.find(x => x.id === data.id);
        if (pushdata === undefined) {
          this.icolist.push(data);
        }
      } else {
        this.icolist.push(data);
      }
    });
    icowithoutlivestream.map(data => {
      if (this.icolist.length > 0) {
        const pushdata = this.icolist.find(x => x.id === data.id);
        if (pushdata === undefined) {
          this.icolist.push(data);
        }
      } else {
        this.icolist.push(data);
      }
    });

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
        icologoimage: Utility.getImageURL(o.icologoimage),
        icoshortdescription: o.icoshortdescription,
        icocreatedon: o.createdon,
        icolivestreamData: Utility.getDiferenceInDays(o.icolivestreamdata),
        iswhitelistjoined: o.iswhitelistjoined,
        id: o.id,
        livestreamstatus: o.livestreamstatus,
        livestreamdate: o.icolivestreamdata ? new Date(o.icolivestreamdata) : undefined
      };
    });
  }
}
