import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider,
  SocialUser
} from 'angular5-social-auth';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';
import { EmailService } from '../services/email.service';
import { IUser } from '../core/Model/IUser';
import { environment } from '../../environments/environment';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  loginForm: FormGroup;
  username = '';
  loginpassword = '';

  private user: SocialUser;
  private loggedIn: boolean;
  userData: IUser;

  constructor(private socialAuthService: AuthService, private regservice: RegistrationService,
    private router: Router, private fb: FormBuilder, private emailservice: EmailService,
    private alertService: AlertCenterService, private spinner: NgxSpinnerService) {

    this.loginForm = fb.group({
      username: ['', Validators.required],
      loginpassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData != null) {
      this.router.navigate(['/Home']);
    }
  }

  AssignLocalStorageData(dbUserData, type) {
    const userData = {
      name: dbUserData[0].name,
      email: dbUserData[0].email,
      image: dbUserData[0].profileimageurl,
      id: dbUserData[0].id,
      type: type,
      ismoderator: dbUserData[0].ismoderator
    };
    this.loggedIn = (userData != null);
    const key = 'UserData';
    localStorage.setItem(key, JSON.stringify(userData));
  }
  RegisterUser(UserData, type) {
    this.regservice.GetUserEmail(UserData.email).subscribe(userData => {
      if (userData[0] !== undefined) {
        if (type === '1') {
          this.spinner.hide();
          this.alertService.alert(new Alert(AlertType.INFO, 'Your email is already present in our system!!!'));
          return;
        } else {
          this.spinner.hide();
          this.AssignLocalStorageData(userData, '2');
          this.router.navigate(['/Home']);
        }
      } else {
        this.userData = {
          name: UserData.name,
          email: UserData.email,
          password: UserData.password,
          bio: UserData.bio,
          id: 0,
          isinvestor: false,
          profileimageurl: UserData.image,
          location: '',
          investmentfocus: '',
          averagenoofinvestment: 0,
          averageinvestmentsizeperyear: 0,
          isactive: UserData.isactive,
          activatekey: this.guid(),
          createdon: new Date().toLocaleDateString(),
          title: '',
          ismoderator: false
        };

        this.regservice.RegisterUser(this.userData).subscribe(registeredData => {
          if (type === '2' && registeredData[0] !== undefined) {
            this.spinner.hide();
            this.AssignLocalStorageData(registeredData, '2');
            this.router.navigate(['/Home']);
          } else {
            const mailData = {
              linktoActivate: environment.AppHostURL + '/Activate?key=' + registeredData[0].activatekey + '&&email=' + registeredData[0].email,
              userName: registeredData[0].name,
              toMailAddress: registeredData[0].email
            };
            this.emailservice.SendActivateMail(mailData).subscribe(alertMessage => {
              this.spinner.hide();
              this.alertService.alert(new Alert(AlertType.SUCCESS, 'Please check your mail to activate your account!!!'));
            });
          }
        },
          error => alert('something error'));
        this.spinner.hide();
      }
    });
  }

  SignIn(loginForm: FormGroup) {
    this.spinner.show();
    this.regservice.GetUserSignIn(loginForm.controls['username'].value, loginForm.controls['loginpassword'].value).subscribe(singInData => {
      if (singInData[1] === true) {
        this.spinner.hide();
        this.AssignLocalStorageData(singInData, '1');
        this.router.navigate(['/Home']);
      } else {
        this.spinner.hide();
        this.alertService.alert(new Alert(AlertType.WARNING, singInData[2]));
      }
    });
  }

  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }


  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'linkedin') {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        const registrationUser = {
          name: userData.name,
          email: userData.email,
          password: 'Social',
          bio: 'using Social login',
          image: userData.image,
          isactive: true,
        };
        this.RegisterUser(registrationUser, '2');

        // Now sign-in with userData
      }
    );
    this.ngOnInit();
  }
}
