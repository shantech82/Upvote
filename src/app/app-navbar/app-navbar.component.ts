import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  SocialUser ,
} from 'angular5-social-auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {

  private user: SocialUser;
  public loggedIn: boolean;

  
  constructor(private socialAuthService: AuthService,
    private router: Router  ) { }

  ngOnInit() {
    let UserData = JSON.parse(localStorage.getItem('UserData'));
    if(UserData != null)
    {
      this.user = UserData;
      this.loggedIn = true;
    }
    else
    {
      this.loggedIn = false;
      this.router.navigate(['/SignIn']);
    }
  }

  public SignOut()
  {
    let UserData = JSON.parse(localStorage.getItem('UserData'));
    if(UserData.type === '2'){
      localStorage.removeItem('UserData');
        this.user == null;
        this.loggedIn = false;
        this.router.navigate(['/SignIn']);
      this.socialAuthService.signOut().then((signoutuser) => {
      });
      
    }
    else
    {
      localStorage.removeItem('UserData');
        this.user == null;
        this.loggedIn = false;
        this.router.navigate(['/SignIn']);
    }
  }
}
