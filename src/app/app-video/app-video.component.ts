import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import {CompanyvideoService} from '../services/companyvideo.service';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { ThrowStmt } from '@angular/compiler';

export interface IVidoe {
  id: number;
  name: string;
  URl: string;
}

@Component({
  selector: 'app-app-video',
  templateUrl: './app-video.component.html',
  styleUrls: ['./app-video.component.css']
})
export class AppVideoComponent implements OnInit {

  companyVideoform: FormGroup;
  videos: IVidoe = {
    id: 0,
    name: '',
    URl: ''
  };
  companyid: any;
  isCompanyCreated: any;


VData: any;

  constructor(private fb: FormBuilder, private cvserv: CompanyvideoService) {
    this.companyVideoform = this.fb.group({
      videoname: ['', Validators.required],
      videourl: ['', Validators.required],
      live: ['', Validators.nullValidator],
    });
  }

  ngOnInit() {
    this.companyid = localStorage.getItem('CompanyId');
    if (this.companyid === undefined) {
      this.isCompanyCreated = false;
    } else {
      this.isCompanyCreated = true;
      this.GetVideos();
    }
  }

  GetVideos() {
    this.cvserv.GetVidoesByCompany(this.companyid).subscribe(data => {
      this.VData = data.vdata;
    });
  }


  deleteVideo(id: number) {
    if (confirm('are you sure want to delete this video')) {
      this.cvserv.DeleteVidoeById(id).subscribe(data => {
        if (data !== undefined) {
          alert('deleted');
          this.GetVideos();
        } else {
          alert('something wrong');
        }
      });
    }
  }

  CVCompany(companyVideoform: FormGroup) {
    if (companyVideoform.valid) {

      if (this.companyid !== undefined) {
        const vidoeurl = companyVideoform.controls['videourl'].value;
        let live: any;
        if (companyVideoform.controls['live'].value === true) {
          live = '1';
        } else {
          live = '0';
        }
        const companyvideodata = {
          name: companyVideoform.controls['videoname'].value,
          vidoeurl: vidoeurl,
          live: live,
          company_id: this.companyid
        };

        this.cvserv.GetVideoByUrl(vidoeurl).subscribe(data => {
          if (data.vdata === undefined) {
            this.cvserv.CreateCompanyVideo(companyvideodata).subscribe(companyData => {
              if (companyData !== undefined) {
                alert('video details inserted');
                this.GetVideos();
              } else {
                alert('something went wrong');
              }
            });
          } else {
            alert('URL already exist');
          }
        });
      } else {
        alert('given details are not valid');
      }
    }
  }
}
