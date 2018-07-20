import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider,
  SocialUser
} from 'angular5-social-auth';
import { Router } from '@angular/router';
import {RegistrationService} from '../services/registration.service';
import { PasswordService } from '../services/password.service';
import { EmailService } from '../services/email.service';
import { CompanyService } from '../services/company.service';
import {IUser} from '../core/Model/IUser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-app-signin',
  templateUrl: './app-signin.component.html',
  styleUrls: ['./app-signin.component.css']
})
export class AppSigninComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  name = '';
  email = '';
  password = '';
  confirmpassword = '';
  aboutyourself = '';
  username = '';
  loginpassword = '';

  private user: SocialUser;
  private loggedIn: boolean;
  userData: IUser;

  constructor( private socialAuthService: AuthService, private regservice: RegistrationService, private compserv: CompanyService,
  private router: Router, private fb: FormBuilder, private securepass: PasswordService, private emailservice: EmailService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required,this.isEmailValid('email')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required],
      aboutyourself: ['', Validators.required]
    }, {
      validator: this.MatchPassword // your validation method
    });

    this.loginForm = fb.group({
      username: ['', Validators.required],
      loginpassword: ['', Validators.required],
    });
  }

  MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
     if (password !== confirmPassword) {
         AC.get('confirmpassword').setErrors( {MatchPassword: true} );
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
        alert('given details are not valid');
      }
  }

  AssignLocalStorageData(dbUserData, type) {
    const userData = {
      name: dbUserData[0].name,
      email: dbUserData[0].email,
      image: dbUserData[0].profileimageurl,
      id: dbUserData[0].id,
      type: type
      };
    this.loggedIn = (userData != null);
    const key = 'UserData';
    localStorage.setItem(key, JSON.stringify(userData));

    this.compserv.GetCompanyByUserId(userData.id).subscribe(Companydata => {
      if (Companydata[0] !== undefined) {
        const companyKey = 'CompanyId';
        localStorage.setItem(companyKey, Companydata[0].id);
      }
    });
  }
  RegisterUser(UserData, type) {
      this.regservice.GetUserEmail(UserData.email).subscribe(userData => {
        if (userData[0] !== undefined) {
          if (type === '1') {
            alert('email already exist');
            return;
          } else {
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
                this.AssignLocalStorageData(registeredData, '2');
                this.router.navigate(['/Home']);
              } else {
                const mailData = {
                  linktoActivate: environment.AppHostURL + '/Activate?key=' + registeredData[0].activatekey + '&&email=' + registeredData[0].email,
                  userName: registeredData[0].name,
                  toMailAddress: registeredData[0].email
                };
                this.emailservice.SendActivateMail(mailData).subscribe(alertMessage => {
                  alert('Activation code send to your mail address, kinldy activate your account to login here');
                });
              }
            },
            error => alert('something error'));
        }
    });
  }

  SignIn(loginForm: FormGroup) {
    this.regservice.GetUserSignIn(loginForm.controls['username'].value, loginForm.controls['loginpassword'].value).subscribe(singInData => {
      if (singInData[1] === true) {
        this.AssignLocalStorageData(singInData, '1');
        this.router.navigate(['/Home']);
      } else {
        alert(singInData[2]);
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
