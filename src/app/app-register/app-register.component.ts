import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider,
} from 'angular5-social-auth';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';
import { EmailService } from '../services/email.service';
import { IUser } from '../core/Model/IUser';
import { environment } from '../../environments/environment';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css']
})
export class AppRegisterComponent implements OnInit {

  registerForm: FormGroup;
  name = '';
  email = '';
  password = '';
  confirmpassword = '';
  aboutyourself = '';

  userData: IUser;

  constructor(private socialAuthService: AuthService, private regservice: RegistrationService,
    private router: Router, private fb: FormBuilder, private emailservice: EmailService,
    private alertService: AlertCenterService, private spinner: NgxSpinnerService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.isEmailValid('email')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required],
      aboutyourself: ['', Validators.required]
    }, {
        validator: this.MatchPassword // your validation method
      });
  }

  MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('confirmpassword').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }

  isEmailValid(emailControl) {
    return emailControl => {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(emailControl.value) ? null : { invalidEmail: true };
    };
  }

  ngOnInit() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData != null) {
      this.router.navigate(['/Home']);
    }
  }

  PostData(registerForm: FormGroup) {
    if (registerForm.valid) {
      this.spinner.show();
      const tempUserData = {
        name: registerForm.controls['name'].value,
        email: registerForm.controls['email'].value,
        password: registerForm.controls['password'].value,
        bio: registerForm.controls['aboutyourself'].value,
        image: '',
        isactive: false,
      };
      this.RegisterUser(tempUserData, '1');
    } else {
      this.alertService.alert(new Alert(AlertType.DANGER, 'Given details are not valid'));
    }
  }

  ClearData() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.isEmailValid('email')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required],
      aboutyourself: ['', Validators.required]
    }, {
        validator: this.MatchPassword // your validation method
      });
  }

  AssignLocalStorageData(dbUserData, type) {
    const userData = {
      name: dbUserData[0].name,
      email: dbUserData[0].email,
      image: dbUserData[0].profileimageurl,
      id: dbUserData[0].id,
      type: type
    };
    // this.loggedIn = (userData != null);
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
          title: ''
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
              this.ClearData();
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
