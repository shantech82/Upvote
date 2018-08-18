import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { IUser } from '../core/Model/IUser';
import { FileuploadService } from '../services/fileupload.service';
import { MasterDataService } from '../services/masterdata.service';
import { Router } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utility } from '../Shared/Utility';

@Component({
  selector: 'app-app-profile-create',
  templateUrl: './app-profile-create.component.html',
  styleUrls: ['./app-profile-create.component.css']
})
export class AppProfileCreateComponent implements OnInit {

  @ViewChild('modalContent') modalContentReference: ElementRef;

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
  submitted: boolean;

  constructor(private icouserprofileservice: RegistrationService, private fuservice: FileuploadService,
    private mdservice: MasterDataService, private router: Router, private alertService: AlertCenterService,
    private modalService: NgbModal, private spinner: NgxSpinnerService) {
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

  ngOnInit() {
    this.spinner.show();
    this.forminitialization = false;
    this.GetUserInfo();
    this.GetNoOfInvestment();
    this.updatedprofileimageurl = '';
  }

  GetNoOfInvestment() {
    this.mdservice.GetNoOfInvestments().subscribe(investmentData => {
      this.investmentData = investmentData[0];
    });
  }

  DeleteUserProfile() {
    this.fuservice.DeleteFile(this.updatedprofileimageurl).subscribe(() => {
      this.icouserprofileservice.DeleteUserProfile(this.userId)
        .then(() => {
          localStorage.removeItem('UserData');
          this.router.navigate(['/Login']);
        }, error => {
          this.alertService.alert(new Alert(AlertType.DANGER, 'There was a problem deleting the user. Please, try again'));
        });
    });
  }

  AssignProfileImage() {
    if (this.icoUserGet !== undefined) {
      this.imageSrc = Utility.getUserImageURL(this.icoUserGet.profileimageurl);
      this.updatedprofileimageurl = Utility.getImageURLforSave(this.icoUserGet.profileimageurl);
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
      if (Utility.isNotEmptyNullUndefined(this.updatedprofileimageurl)) {
        this.fuservice.DeleteFile(this.updatedprofileimageurl).subscribe(() => {
          this.fuservice.UploadCompanyImage(formData).subscribe(filename => {
            this.updatedprofileimageurl = filename;
          });
        });
      } else {
        this.fuservice.UploadCompanyImage(formData).subscribe(filename => {
          this.updatedprofileimageurl = filename;
        });
      }
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
      this.icouserprofileservice.GetSingleUser(this.userId).subscribe(userData => {
        this.icoUserGet = userData[0];
        if (this.icoUserGet !== undefined && this.icoUserGet.id !== undefined) {
        this.AssignProfileImage();
        this.createFormControls();
        this.createForm();
        this.forminitialization = true;
        } else {
          localStorage.removeItem('UserData');
          this.router.navigate(['/Login']);
        }
        this.spinner.hide();
      });
    }
  }

  UpdateICOProfile(icoprofileform: FormGroup) {
    if (icoprofileform.valid) {
      this.submitted = false;
      // gettting userid
      this.spinner.show();
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
          ismoderator: false
        };
        this.icouserprofileservice.UpdateICOUserProfile(this.icoUser).subscribe(returnValue => {
          if (returnValue !== undefined) {
            this.spinner.hide();
            this.alertService.alert(new Alert(AlertType.SUCCESS, 'Your profile has been updated!!!'));
            this.router.navigate(['/UProfile']);
          } else {
            this.spinner.hide();
            this.alertService.alert(new Alert(AlertType.DANGER, 'Something went wrong, please try again after some time'));
          }
        });
      } else {
        this.spinner.hide();
        this.alertService.alert(new Alert(AlertType.WARNING, 'Your profile not found'));
      }
    } else {
      this.submitted = true;
      this.alertService.alert(new Alert(AlertType.WARNING, 'Your input is not valid'));
    }
  }
}
