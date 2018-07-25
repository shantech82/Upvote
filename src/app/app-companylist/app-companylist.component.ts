import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { IICOList } from '../core/Model/IICOList';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

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
    loops: false,
    breakpoints: {
        // when window width is <= 320px
        320: {
            slidesPerView: 1,
            spaceBetween: 10
        },
        // when window width is <= 480px
        480: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        // when window width is <= 640px
        640: {
            slidesPerView: 3,
            spaceBetween: 30
        },
        // when window width is <= 1024px
        1024: {
            slidesPerView: 4,
            spaceBetween: 30
        }
    }
};

  icolist: IICOList[];
  forminitialization: boolean;
  page: string;
  topicolist: IICOList;
  isICOAvailable: boolean;

  constructor(private icoservice: CompanyService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.GetUAllICOs();
    this.page = 'ico';
  }

  GetUAllICOs() {
    this.icoservice.GetAllICOs().then(userICOsData => {
      const investorICO = userICOsData[0];
      this.AssignICOData(investorICO);
      this.topicolist = this.icolist[0];
      this.forminitialization = true;
      if (this.icolist[0].iconame !== null) {
        this.isICOAvailable = true;
      } else {
        this.isICOAvailable = false;
      }
      this.spinner.hide();
    });
  }

  AssignICOData(apiICOData: any) {
    this.icolist = apiICOData.map(o => {
      return {
        iconame: o.iconame,
        icologoimage: this.AssignLogomage(o.icologoimage),
        icoshortdescription: o.icoshortdescription,
        icocreatedon: o.createdon,
        icolivestreamData: this.getDiferenceInDays(o.icolivestreamdata),
        iswhitelistjoined: o.iswhitelistjoined
      };
    });
  }
  AssignLogomage(icoImage: string): string {
    if (this.IfNotEmptyNullUndefined(icoImage)) {
      return environment.ApiHostURL + 'static/companyimages/' + icoImage;
    } else {
      return '../../assets/img/icoimagecard.jpg';
    }
  }
  IfNotEmptyNullUndefined(value: string) {
    if (value !== null && value !== '' && value !== undefined) {
      return true;
    } else {
      return false;
    }
  }
  getDiferenceInDays(theDate: string): number {
    if (this.IfNotEmptyNullUndefined(theDate)) {
      const newDate = new Date(theDate);
      return Math.round(Math.abs((newDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    }
  }
}
