import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../services/registration.service';
import { IUser } from '../core/Model/IUser';
import { IICOList } from '../core/Model/IICOList';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { UrlparserService } from '../services/urlparser.service';
import { Datetimeutility } from '../Shared/datetimeutility';
import { Icoutility } from '../Shared/icoutility';

@Component({
  selector: 'app-app-profile-view',
  templateUrl: './app-profile-view.component.html',
  styleUrls: ['./app-profile-view.component.css']
})
export class AppProfileViewComponent implements OnInit {

  userType: string;
  userId: number;
  investedICOSInitialization: boolean;
  ownICOsInitialization: boolean;
  userintilization: boolean;
  user: IUser;
  imageSrc: string;
  icolist: IICOList[];
  yourICOList: IICOList[];
  averageinvestmentsizeperyear: string;
  page: string;
  isICOAvailable: boolean;
  investordisplayText: string;
  yourdisplayText: string;

  constructor(private icouserprofileservice: RegistrationService, private spinner: NgxSpinnerService,
    private router: Router, private urlservice: UrlparserService) { }

  ngOnInit() {
    this.spinner.show();
    this.GetUserWithICOsInfo();
    this.page = 'investor';
  }

  AssignUserData(apiUserData: any) {
    this.user = apiUserData[0];
    this.averageinvestmentsizeperyear = apiUserData[0].averageinvestmentsizeperyear;
  }

  AssignICOData(apiICOData: any): IICOList[] {
    return apiICOData.map(o => {
      return {
        iconame: o.iconame,
        icologoimage: o.icologoimage,
        icoshortdescription: o.icoshortdescription,
        icocreatedon: o.icocreatedon,
        icolivestreamData: Datetimeutility.getDiferenceInDays(o.icolivestreamdata),
        iswhitelistjoined: o.iswhitelistjoined,
        id: o.id,
        livestreamstatus: o.livestreamstatus,
        livestreamdate: o.icolivestreamdata ? new Date(o.icolivestreamdata) : undefined
      };
    });
  }

  AssignImageURLforinvestorICOs() {
    const count = this.icolist.length;
    let index = 1;
    this.icolist.map(o => {
      this.urlservice.GetFileURL(o.icologoimage, 'icoimage').subscribe(value => {
        o.icologoimage = value;
        index++;
        if (index > count) {
          this.investedICOSInitialization = true;
        }
      });
    });
  }

  AssignImageURLforOwnICOs() {
    const count = this.yourICOList.length;
    let index = 1;
    this.yourICOList.map(o => {
      this.urlservice.GetFileURL(o.icologoimage, 'icoimage').subscribe(value => {
        o.icologoimage = value;
        index++;
        if (index > count) {
          this.ownICOsInitialization = true;
        }
      });
    });
  }

  InvestedICOSorting() {
    const icowithlivesteam: IICOList[] = Icoutility.ICOSorting(this.icolist.filter(ico => ico.livestreamdate !== undefined), true);
    const icowithoutlivestream: IICOList[] = Icoutility.ICOSorting(this.icolist.filter(ico => ico.livestreamdate === undefined), true);

    this.icolist = [];
    this.icolist.push.apply(this.icolist, icowithlivesteam);
    this.icolist.push.apply(this.icolist, icowithoutlivestream);
  }

  OwnICOSorting() {
    const icowithlivesteam: IICOList[] = Icoutility.ICOSorting(this.yourICOList.filter(ico => ico.livestreamdate !== undefined), true);
    const icowithoutlivestream: IICOList[] = Icoutility.ICOSorting(this.yourICOList.filter(ico => ico.livestreamdate === undefined), true);

    this.yourICOList = [];
    this.yourICOList.push.apply(this.yourICOList, icowithlivesteam);
    this.yourICOList.push.apply(this.yourICOList, icowithoutlivestream);
  }

  GetUserWithICOsInfo() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
      this.userId = UserData.id;
      this.userType = UserData.type;
      this.icouserprofileservice.GetInvestorWithICOs(this.userId).subscribe(userICOsData => {
        if (userICOsData[0].length > 0) {
          const investorICO = userICOsData[0];
          this.AssignUserData(investorICO);
          this.icolist = this.AssignICOData(investorICO);
          this.urlservice.GetFileURL(this.user.profileimageurl, 'icouser').subscribe(value => {
            this.user.profileimageurl = value;
            this.userintilization = true;
          });
          if (this.icolist[0].iconame !== null) {
            this.isICOAvailable = true;
            this.investordisplayText = 'INV ICOs';
            this.InvestedICOSorting();
            this.AssignImageURLforinvestorICOs();
          } else {
            this.isICOAvailable = false;
            this.investedICOSInitialization = true;
          }
          this.icouserprofileservice.GetOwnICOs(this.userId).subscribe(ownICOSData => {
            if (ownICOSData[0].length > 0) {
              const ownICO = ownICOSData[0];
              this.yourICOList = this.AssignICOData(ownICO);
              this.yourdisplayText = 'own ICOs';
              this.OwnICOSorting();
              this.AssignImageURLforOwnICOs();
            } else {
              this.ownICOsInitialization = true;
            }
          });
        } else {
          this.isICOAvailable = false;
          localStorage.removeItem('UserData');
          this.router.navigate(['/Login']);
        }
        this.spinner.hide();
      });
    }
  }
}
