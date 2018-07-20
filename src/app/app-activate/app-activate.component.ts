import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {RegistrationService} from '../services/registration.service';

@Component({
  selector: 'app-app-activate',
  templateUrl: './app-activate.component.html',
  styleUrls: ['./app-activate.component.css']
})
export class AppActivateComponent implements OnInit {

  activatekey: string;
  email: string;

  constructor(private router: ActivatedRoute, private regservice: RegistrationService) {
    this.router.queryParams.subscribe(params => {
        this.activatekey = params['key'];
        this.email = params['email'];
    });
  }

  public userActivatestatus: boolean;
  ngOnInit() {
    this.regservice.PutActivateUser(this.email, this.activatekey).subscribe(activateData => {
      if (activateData[1] === true) {
        this.userActivatestatus = true;
      } else {
        this.userActivatestatus = false;
      }
    });
  }

}
