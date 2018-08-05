import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  SocialUser ,
} from 'angular5-social-auth';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {

  public user: SocialUser;
  public loggedIn: boolean;


  constructor(private socialAuthService: AuthService,
    private router: Router  ) { }

  ngOnInit() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData != null) {
      this.user = UserData;
      this.AssignProfileImage();
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
      this.router.navigate(['/Login']);
    }
  }

  AssignProfileImage() {
    if (this.user !== undefined) {
      if (this.IfNotEmptyNullUndefined(this.user.image)) {
        if (this.user.image.indexOf('http') === -1) {
          this.user.image = environment.ApiHostURL + 'static/companyimages/' + this.user.image;
        } else {
          this.user.image = this.user.image;
        }
      } else {
        this.user.image = '../../assets/img/ico-user.png';
      }
    }
  }

  IfNotEmptyNullUndefined(value: string) {
    if (value !== null && value !== '' && value !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  public SignOut() {
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
