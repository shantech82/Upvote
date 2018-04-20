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

  constructor(private router: ActivatedRoute,private regservice: RegistrationService) { 
    this.router.queryParams.subscribe(params => {
        this.activatekey = params['key'];
        this.email = params['email'];
    })
  }

  private userActivatestatus: boolean;
  ngOnInit() {
    this.regservice.PutActivateUser(this.email,this.activatekey).subscribe(data => {
      if(data.message === true){
        this.userActivatestatus = true;
      }
      else{
        this.userActivatestatus = false;
      }
    });
  }

}
