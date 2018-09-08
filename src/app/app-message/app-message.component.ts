import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-message',
  templateUrl: './app-message.component.html',
  styleUrls: ['./app-message.component.css']
})
export class AppMessageComponent implements OnInit {

  email: string;
  type: string;

  constructor(private activateRoute: ActivatedRoute) {
    this.activateRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.type = params['type'];
      if (this.email === undefined) {
        this.email = '';
      }
    });
   }

  ngOnInit() {
  }

}
