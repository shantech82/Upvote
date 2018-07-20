import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { IUser } from '../core/Model/IUser';
import { FileuploadService } from '../services/fileupload.service';
import { environment } from '../../environments/environment';
import { MasterDataService } from '../services/masterdata.service';
import { Router } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-app-profile-create',
  templateUrl: './app-profile-create.component.html',
  styleUrls: ['./app-profile-create.component.css']
})
export class AppProfileCreateComponent implements OnInit {

  icouserprofileupdate: IUser;
  icoprofileform: FormGroup;

  name: FormControl;
  title: FormControl;
  email: FormControl;
  isinvestor: FormControl;
  profileimageurl: FormControl;
  location: FormControl;
  bio: FormControl;
  investmentfocus: FormControl;
  averagenoofinvestment: FormControl;
  averageinvestmentsizeperyear: FormControl;

  userType: string;
  userId: number;
  filesToUpload: File = null;
  imageSrc: string;
  updatedprofileimageurl: string;

  icoUser: IUser;
  icoUserGet: IUser;

  forminitialization: boolean;
  investmentData: any;


  constructor(private icouserprofileservice: RegistrationService, private fuservice: FileuploadService,
    private mdservice: MasterDataService, private router: Router, private alertService: AlertCenterService,
    private modalService: NgbModal) {
  }

  createFormControls() {
    this.name = new FormControl(this.icoUserGet.name, Validators.required);
    this.title = new FormControl(this.icoUserGet.title, Validators.required);
    this.email = new FormControl(this.icoUserGet.email, [Validators.required]);
    this.location = new FormControl(this.icoUserGet.location, Validators.required);
    this.bio = new FormControl(this.icoUserGet.bio, [Validators.required, Validators.minLength(100)]);
    this.investmentfocus = new FormControl(this.icoUserGet.investmentfocus, Validators.required);
    this.isinvestor = new FormControl(this.icoUserGet.isinvestor);
    this.averagenoofinvestment = new FormControl(this.icoUserGet.averagenoofinvestment);
    this.averageinvestmentsizeperyear = new FormControl(this.icoUserGet.averageinvestmentsizeperyear);
  }

  createForm() {
    this.icoprofileform = new FormGroup({
      name: this.name,
      email: this.email,
      title: this.title,
      location: this.location,
      bio: this.bio,
      investmentfocus: this.investmentfocus,
      isinvestor: this.isinvestor,
      averagenoofinvestment: this.averagenoofinvestment,
      averageinvestmentsizeperyear: this.averageinvestmentsizeperyear
    });
  }

  isEmailValid(control) {
    return value => {
      const regex = new RegExp(['/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}',
        '\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;'].join(''));
      return regex.test(control.value) ? null : { invalidEmail: true };
    };
  }

  ngOnInit() {
    this.forminitialization = false;
    this.GetUserInfo();
    this.GetNoOfInvestment();
  }

  IfNotEmptyNullUndefined(value: string) {
    if (value !== null && value !== '' && value !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  GetNoOfInvestment() {
      this.mdservice.GetNoOfInvestments().subscribe(investmentData => {
          this.investmentData = investmentData[0];
          console.log(this.investmentData);
      });
  }

  DeleteUserProfile() {
    this.icouserprofileservice.DeleteUserProfile(this.userId);
    alert('user deleted');
    localStorage.removeItem('UserData');
    this.router.navigate(['/SignIn']);
  }
  AssignProfileImage() {
    if (this.icoUserGet !== undefined) {
      if (this.IfNotEmptyNullUndefined(this.icoUserGet.profileimageurl)) {
        if (this.icoUserGet.profileimageurl.indexOf('http') === -1) {
          this.imageSrc = environment.ApiHostURL + 'static/companyimages/' + this.icoUserGet.profileimageurl;
          this.updatedprofileimageurl = this.icoUserGet.profileimageurl;
        } else {
          this.imageSrc = this.icoUserGet.profileimageurl;
          this.updatedprofileimageurl = this.icoUserGet.profileimageurl;
        }
      } else {
        this.imageSrc = '../../assets/img/ico-user@2x.png';
      }
    }
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files[0].type.startsWith('image')) {
      this.filesToUpload = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(fileInput.target.files[0]);
      const nameofUser = this.icoUserGet.name;
      // uploading user profile image
      const formData: any = new FormData();
      const modifiedfilename = nameofUser + Date.now() + this.filesToUpload.name;
      formData.append('file', this.filesToUpload, modifiedfilename);
      this.fuservice.UploadCompanyImage(formData).subscribe(filename => {
        this.updatedprofileimageurl = filename;
      });
    } else {
      this.imageSrc = '../../assets/img/ico-user@2x.png';
      this.alertService.alert(new Alert(AlertType.WARNING, 'please check your profile image format'));
    }
  }

  GetUserInfo() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
      this.userId = UserData.id;
      this.userType = UserData.type;
      this.icouserprofileservice.GetSingleUser(this.userId).then(userData => {
        this.icoUserGet = userData[0];
        this.AssignProfileImage();
        this.createFormControls();
        this.createForm();
        this.forminitialization = true;
      });
    }
  }

  UpdateICOProfile(icoprofileform: FormGroup) {
    if (icoprofileform.valid) {
      // gettting userid
      const UserData = JSON.parse(localStorage.getItem('UserData'));
      if (UserData != null) {
        const userid = UserData.id;
        const nameofUser = icoprofileform.controls['name'].value;
        this.icoUser = {
          name: nameofUser,
          email: icoprofileform.controls['email'].value,
          isinvestor: icoprofileform.controls['isinvestor'].value,
          profileimageurl: this.updatedprofileimageurl,
          location: icoprofileform.controls['location'].value,
          bio: icoprofileform.controls['bio'].value,
          investmentfocus: icoprofileform.controls['investmentfocus'].value,
          averagenoofinvestment: icoprofileform.controls['averagenoofinvestment'].value,
          averageinvestmentsizeperyear: icoprofileform.controls['averageinvestmentsizeperyear'].value,
          id: userid,
          password: '',
          isactive: false,
          activatekey: '',
          createdon: '',
          title: icoprofileform.controls['title'].value,
        };
        this.icouserprofileservice.UpdateICOUserProfile(this.icoUser).subscribe(returnValue => {
          if (returnValue !== undefined) {
            this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your profile has been updated!!!'));
          } else {
            this.alertService.alert(new Alert(AlertType.DANGER, 'Something went wrong, please try again after some time'));
          }
        });
      } else {
        this.alertService.alert(new Alert(AlertType.WARNING, 'Your profile not found'));
      }
    } else {
      this.alertService.alert(new Alert(AlertType.WARNING, 'Your input is not valid'));
    }
  }
}
