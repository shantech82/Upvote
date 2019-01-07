import { Component, OnInit } from '@angular/core';
import { FileuploadService } from '../services/fileupload.service';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-app-imagegenerate',
  templateUrl: './app-imagegenerate.component.html',
  styleUrls: ['./app-imagegenerate.component.css']
})
export class AppImagegenerateComponent implements OnInit {

  formintilization: boolean;
  filenames: any;
  imgageurl: string;
  constructor(private fsservice: FileuploadService, private alertService: AlertCenterService) { }

  ngOnInit() {
      this.getAllFilesName();
  }

  getAllFilesName() {
    this.fsservice.GetAllFilesName().subscribe(filenamedata => {
      this.filenames = filenamedata[0];
      this.formintilization = true;
    });
  }

  generateFile(filename) {
    this.fsservice.GenerateFile(filename).subscribe(status => {
      if (status[0]) {
        this.alertService.alert(new Alert(AlertType.SUCCESS, 'File is available'));
      } else {
        this.alertService.alert(new Alert(AlertType.WARNING, 'File is not available'));
      }
    });
  }

  checkFile(filename) {
    this.fsservice.checkFileURL(filename).subscribe(status => {
      if (status[0] === true) {
        this.imgageurl = environment.ApiHostURL + 'static/' + filename;
        this.alertService.alert(new Alert(AlertType.SUCCESS, 'File is available'));
      } else {
        this.alertService.alert(new Alert(AlertType.WARNING, 'File is not available'));
      }
    });
  }
}
