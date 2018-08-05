import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../services/registration.service';
import { IUser } from '../core/Model/IUser';
import { IICOList } from '../core/Model/IICOList';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-app-profile-view',
  templateUrl: './app-profile-view.component.html',
  styleUrls: ['./app-profile-view.component.css']
})
export class AppProfileViewComponent implements OnInit {

  userType: string;
  userId: number;
  forminitialization: boolean;
  user: IUser;
  imageSrc: string;
  icolist: IICOList[];
  averageinvestmentsizeperyear: string;
  page: string;
  isICOAvailable: boolean;

  constructor(private icouserprofileservice: RegistrationService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.GetUserWithICOsInfo();
    this.page = 'investor';
  }

  AssignUserData(apiUserData: any) {
    this.user = apiUserData[0];
    this.averageinvestmentsizeperyear = apiUserData[0].averageinvestmentsizeperyear;
  }

  AssignICOData(apiICOData: any) {
    this.icolist = apiICOData.map(o => {
      return {
        iconame: o.iconame,
        icologoimage: this.AssignLogomage(o.icologoimage),
        icoshortdescription: o.icoshortdescription,
        icocreatedon: o.icocreatedon,
        icolivestreamData: this.getDiferenceInDays(o.icolivestreamdata),
        iswhitelistjoined: o.iswhitelistjoined
      };
  });
}

  GetUserWithICOsInfo() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
      this.userId = UserData.id;
      this.userType = UserData.type;
      this.icouserprofileservice.GetInvestorWithICOs(this.userId).then(userICOsData => {
        const investorICO = userICOsData[0];
        this.AssignUserData(investorICO);
        this.AssignICOData(investorICO);
        this.AssignProfileImage();
        this.forminitialization = true;
        if (this.icolist[0].iconame !== null) {
          this.isICOAvailable = true;
        } else {
          this.isICOAvailable = false;
        }
        this.spinner.hide();
        });
      }
    }

  getDiferenceInDays(theDate: string): number {
    if (this.IfNotEmptyNullUndefined(theDate)) {
      const newDate = new Date(theDate);
      return Math.round(Math.abs((newDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    }
  }

  AssignProfileImage() {
    if (this.user !== undefined) {
      if (this.IfNotEmptyNullUndefined(this.user.profileimageurl)) {
        if (this.user.profileimageurl.indexOf('http') === -1) {
          this.user.profileimageurl = environment.ApiHostURL + 'static/companyimages/' + this.user.profileimageurl;
        } else {
          this.user.profileimageurl = this.user.profileimageurl;
        }
      } else {
        this.user.profileimageurl = '../../assets/img/ico-user.png';
      }
    }
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


}
