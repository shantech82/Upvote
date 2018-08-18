import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../services/registration.service';
import { IUser } from '../core/Model/IUser';
import { IICOList } from '../core/Model/IICOList';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utility } from '../Shared/Utility';
import { Router } from '@angular/router';

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

  constructor(private icouserprofileservice: RegistrationService, private spinner: NgxSpinnerService,
    private router: Router) { }

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
        icologoimage: Utility.AssignLogomage(o.icologoimage),
        icoshortdescription: o.icoshortdescription,
        icocreatedon: o.icocreatedon,
        icolivestreamData: Utility.getDiferenceInDays(o.icolivestreamdata),
        iswhitelistjoined: o.iswhitelistjoined
      };
    });
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
          this.AssignICOData(investorICO);
          this.user.profileimageurl = Utility.getUserImageURL(this.user.profileimageurl);
          this.forminitialization = true;
          if (this.icolist[0].iconame !== null) {
            this.isICOAvailable = true;
          } else {
            this.isICOAvailable = false;
          }
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
