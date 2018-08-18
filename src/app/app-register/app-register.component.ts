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
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utility } from '../Shared/Utility';

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
  submitted: boolean;

  constructor(private socialAuthService: AuthService, private regservice: RegistrationService,
    private router: Router, private fb: FormBuilder, private emailservice: EmailService,
    private alertService: AlertCenterService, private spinner: NgxSpinnerService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Utility.isEmailValid('email')]],
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

  ngOnInit() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData != null) {
      this.router.navigate(['/Home']);
    }
  }

  PostData(registerForm: FormGroup) {
    if (registerForm.valid) {
      this.submitted = false;
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
      this.submitted = true;
      this.alertService.alert(new Alert(AlertType.WARNING, 'Given details are not valid'));
    }
  }

  ClearData() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Utility.isEmailValid('email')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required],
      aboutyourself: ['', Validators.required]
    }, {
        validator: this.MatchPassword // your validation method
      });
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
          Utility.assignLocalStorageData(userData, '2');
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
          activatekey: Utility.generatingActivateKey(),
          createdon: new Date().toLocaleDateString('en-Us'),
          title: '',
          ismoderator: false
        };
        this.regservice.RegisterUser(this.userData).subscribe(registeredData => {
          if (type === '2' && registeredData[0] !== undefined) {
            this.spinner.hide();
            Utility.assignLocalStorageData(registeredData, '2');
            this.router.navigate(['/Home']);
          } else {
            const mailData = Utility.getMailData(registeredData[0].activatekey, registeredData[0].email, registeredData[0].name);
            this.emailservice.SendActivateMail(mailData).subscribe(alertMessage => {
              this.ClearData();
              this.spinner.hide();
              this.alertService.alert(new Alert(AlertType.SUCCESS, 'Please check your mail to activate your account!!!'));
            });
          }
        },
          error => alert(error));
        this.spinner.hide();
      }
    });
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
