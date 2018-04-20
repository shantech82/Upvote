import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,FormBuilder,Validators,NgForm,AbstractControl } from '@angular/forms';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider,
  SocialUser
} from 'angular5-social-auth';
import { Router } from '@angular/router';
import {RegistrationService} from '../services/registration.service'; 
import { DatePipe } from '@angular/common';
import { PasswordService } from '../services/password.service';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-app-signin',
  templateUrl: './app-signin.component.html',
  styleUrls: ['./app-signin.component.css']
})
export class AppSigninComponent implements OnInit {

  loginForm:FormGroup;
  registerForm:FormGroup;
  name:string="";
  email:string="";
  password:string="";
  confirmpassword:string="";
  aboutyourself:string="";
  username:string="";
  loginpassword:string="";

  constructor( private socialAuthService: AuthService,private regservice: RegistrationService,
  private router: Router,private fb: FormBuilder,private securepass : PasswordService,private emailservice:EmailService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required,this.isEmailValid('email')]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      confirmpassword: ['', Validators.required],
      aboutyourself: ['', Validators.required]
    },{
      validator: this.MatchPassword // your validation method
    })

    this.loginForm = fb.group({
      username: ['', Validators.required],
      loginpassword: ['', Validators.required],
    });
  }

  isEmailValid(control) {
    return control => {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(control.value) ? null : { invalidEmail: true };
    }
  }


  MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
     if(password != confirmPassword) {
         AC.get('confirmpassword').setErrors( {MatchPassword: true} )
     } else {
         return null
     }
 }

  private user: SocialUser;
  private loggedIn: boolean;
  
  ngOnInit() {
    let UserData = JSON.parse(localStorage.getItem('UserData'));
    console.log(UserData);
    if(UserData != null)
    {
      this.router.navigate(['/Home']);
    }
  }
  PostData(registerForm:NgForm){
    if(registerForm.valid){
      let UserData = {
      name: registerForm.controls['name'].value,
      email: registerForm.controls['email'].value,
      password: registerForm.controls['password'].value,
      aboutyourself: registerForm.controls['aboutyourself'].value,
      }
      this.RegisterUser(UserData,'1')
      }
      else{
        alert("given details are not valid")
      }
  }

  AssignLocalStorageData(dbUserData,type){
    let userData = {
      name: dbUserData.name,
      email: dbUserData.email,
      image: null,
      id: dbUserData.id,
      type:type
      }
    this.loggedIn = (userData != null);
    let key = 'UserData';
    localStorage.setItem(key, JSON.stringify(userData));
  }


  RegisterUser(UserData,type){
      this.regservice.GetUserEmail(UserData.email).subscribe(data => {
        if(data.userData != undefined){
          if(type === '1'){
            alert("email already exist")
            return;
          }
          else{
            this.AssignLocalStorageData(data.userData,'2');
            this.router.navigate(['/Home']);
          }
        }
        else{
          let registrationUser = {
            name: UserData.name,
            email: UserData.email,
            password: UserData.password,
            aboutyourself: UserData.aboutyourself,
            isactive: false,
            activatekey: this.guid(),
            createdon: new Date().toISOString()
            }
            console.log(registrationUser);
            this.regservice.RegisterUser(registrationUser).subscribe(data => {
              if(type === '2'){
                this.AssignLocalStorageData(data.userData,'2');
                this.router.navigate(['/Home']);
              }
              else{
                let mailData = {
                  linktoActivate: "https://localhost:4200/Activate?key="+data.userData.activatekey + "&&email="+data.userData.email,
                  userName:data.userData.name,
                  toMailAddress:data.userData.email
                }
                this.emailservice.SendActivateMail(mailData).subscribe(data => {
                  alert('Activation code send to your mail address, kinldy activate your account to login here');
                })
              }
            },
            error => alert(error))
        }
    });
  }

  SignIn(loginForm:NgForm)  
  {  
    this.regservice.GetUserSignIn(loginForm.controls['username'].value,loginForm.controls['loginpassword'].value).subscribe(data => {
      if(data.status === 'success'){
        this.AssignLocalStorageData(data.userData,'1');
        this.router.navigate(['/Home']);
      }
      else
      {
        alert(data.message);
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
  

  public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "linkedin"){
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
      
        console.log(userData);
        let registrationUser = {
          name: userData.name,
          email: userData.email,
          password: "Social",
          aboutyourself: "using Social login",
        }
        this.RegisterUser(registrationUser,'2');
        
        // Now sign-in with userData
      }
    );
    this.ngOnInit();
  }
}
