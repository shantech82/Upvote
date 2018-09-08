import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  SocialUser,
} from 'angular5-social-auth';
import { Router } from '@angular/router';
import { Utility } from '../Shared/Utility';
import { RegistrationService } from '../services/registration.service';
import { UrlparserService } from '../services/urlparser.service';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {

  public user: SocialUser;
  public loggedIn: boolean;
  mobileMenu: boolean;
  formintilization: boolean;


  constructor(private socialAuthService: AuthService, private registrationser: RegistrationService,
    private router: Router, private urlservice: UrlparserService) { }

  ngOnInit() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData != null) {
        this.user = UserData;
        this.urlservice.GetFileURL(this.user.image, 'icouser').subscribe(value => {
          this.user.image = value;
          this.formintilization = true;
        });
        this.loggedIn = true;
    } else {
      this.loggedIn = false;
      this.router.navigate(['/Login']);
    }
    this.mobileMenu = false;
  }

  mobileMenuShow() {
    if (this.mobileMenu === false) {
      this.mobileMenu = true;
    } else {
      this.mobileMenu = false;
    }
  }

  SignOut() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData.type === '2') {
      localStorage.removeItem('UserData');
      localStorage.removeItem('CompanyId');
      this.user = null;
      this.loggedIn = false;
      this.router.navigate(['/Login']);
      this.socialAuthService.signOut().then((signoutuser) => {
      });

    } else {
      localStorage.removeItem('UserData');
      localStorage.removeItem('CompanyId');
      this.user = null;
      this.loggedIn = false;
      this.router.navigate(['/Login']);
    }
  }
}
