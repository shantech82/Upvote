import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../services/registration.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-app-activate',
  templateUrl: './app-activate.component.html',
  styleUrls: ['./app-activate.component.css']
})
export class AppActivateComponent implements OnInit {

  activatekey: string;
  email: string;

  constructor(private router: ActivatedRoute, private route: Router,
    private regservice: RegistrationService, private spinner: NgxSpinnerService) {
    this.router.queryParams.subscribe(params => {
        this.activatekey = params['key'];
        this.email = params['email'];
    });
  }

  public userActivatestatus: boolean;
  ngOnInit() {
    this.spinner.show();
    this.regservice.PutActivateUser(this.email, this.activatekey).subscribe(activateData => {
      if (activateData[1] === true) {
        this.userActivatestatus = true;
        setTimeout(() => {
          this.spinner.hide();
          this.route.navigate(['/Home']);
        }, 1000);
      } else {
        this.userActivatestatus = false;
      }
    });
  }

}
