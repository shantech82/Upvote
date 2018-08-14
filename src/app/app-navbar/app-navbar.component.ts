import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  SocialUser ,
} from 'angular5-social-auth';
import { Router } from '@angular/router';
import { Utility } from '../Shared/Utility';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {

  public user: SocialUser;
  public loggedIn: boolean;
  mobileMenu: boolean;


  constructor(private socialAuthService: AuthService,
    private router: Router  ) { }

  ngOnInit() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData != null) {
      this.user = UserData;
      this.user.image = Utility.getUserImageURL(this.user.image);
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
