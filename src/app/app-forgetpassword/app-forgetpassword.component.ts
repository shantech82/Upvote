import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '../../../node_modules/@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { EmailService } from '../services/email.service';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { NgxSpinnerService } from '../../../node_modules/ngx-spinner';
import { Iforgetpassword } from '../core/Model/IUser';
import { Utility } from '../Shared/Utility';

@Component({
  selector: 'app-app-forgetpassword',
  templateUrl: './app-forgetpassword.component.html',
  styleUrls: ['./app-forgetpassword.component.css']
})
export class AppForgetpasswordComponent implements OnInit {

  forgotpasswordgrp: FormGroup;
  forgotpasswordchangegrp: FormGroup;
  username = '';
  userData: Iforgetpassword;
  submitted: boolean;
  password = '';
  confirmpasswrod = '';
  switchcontent: boolean;

  constructor(private regservice: RegistrationService, private router: Router, private fb: FormBuilder, private emailservice: EmailService,
    private alertService: AlertCenterService, private spinner: NgxSpinnerService, private activateRoute: ActivatedRoute,
    private route: Router) {
    this.forgotpasswordgrp = fb.group({
      username: ['', Validators.required],
    });

    this.forgotpasswordchangegrp = fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required],
    },
    {
      validator: this.MatchPassword // your validation method
    });

    this.activateRoute.queryParams.subscribe(params => {
      if (params !== undefined) {
        this.userData = {
          id:  0,
          email:  params['email'],
          password:  '',
          activatekey: params['key']
        };
      }
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
    if (this.userData.email !== undefined) {
      this.switchcontent = true;
    } else {
      this.switchcontent = false;
    }
  }

  forgotpasswordclick(forgotpasswordgrp: FormGroup) {
    if (forgotpasswordgrp.valid) {
      this.submitted = false;
      this.spinner.show();
      const userName = forgotpasswordgrp.controls['username'].value;
      this.regservice.GetUserEmail(userName).subscribe(userData => {
        if (userData[0] !== undefined) {
          const activatekey = Utility.generatingActivateKey();
          const mailData = Utility.getMailDataForPassword(activatekey, userData[0].email, userData[0].name);

          this.userData = {
            id:  userData[0].id,
            email:  userData[0].email,
            password:  '',
            activatekey: activatekey
          };

          this.regservice.PutActivateKey(this.userData).subscribe();
            this.emailservice.SendPasswordResetMail(mailData).subscribe(alertMessage => {
              this.spinner.hide();
              this.router.navigate(['/Message'], { queryParams: { email: userName, type: '2' } });
            });
        } else {
          this.spinner.hide();
          this.alertService.alert(new Alert(AlertType.INFO, 'Sorry!!! Your email is is not present in our sytem.'));
        }
      });
    }
  }

  passwordChangeclick(forgotpasswordchangegrp: FormGroup) {
    if (forgotpasswordchangegrp.valid) {
      this.spinner.show();
      this.submitted = false;
      this.spinner.show();
      this.regservice.GetUserEmail(this.userData.email).subscribe(userData => {
        if (userData[0] !== undefined) {
          this.userData.password = forgotpasswordchangegrp.controls['password'].value;
          this.userData.id = userData[0].id;
          this.regservice.PutChangePassword(this.userData).subscribe(returnvalue => {
            this.spinner.hide();
            if (returnvalue !== undefined && returnvalue[1]) {
              this.route.navigate(['/Home']);
            } else {
              this.alertService.alert(new Alert(AlertType.INFO, returnvalue[0]));
            }
          });
        } else {
          this.spinner.hide();
          this.alertService.alert(new Alert(AlertType.INFO, 'Sorry!!! Your email is is not present in our sytem.'));
        }
      });
    }
  }

}
