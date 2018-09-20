import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyService } from '../services/company.service';
import { IICO } from '../core/Model/IICO';
import { FileuploadService } from '../services/fileupload.service';
import { MasterDataService } from '../services/masterdata.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertCenterService, Alert, AlertType } from 'ng2-alert-center';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utility } from '../Shared/Utility';
import { UrlparserService } from '../services/urlparser.service';
import { Datetimeutility } from '../Shared/datetimeutility';
import { Urlutility } from '../Shared/urlutility';

@Component({
  selector: 'app-app-company',
  templateUrl: './app-company.component.html',
  styleUrls: ['./app-company.component.css']
})

export class AppCompanyComponent implements OnInit {

  filesToUpload: File = null;
  fileToDisplay: any = null;
  videoToUpload: File = null;

  iconame: FormControl;
  smn_twitter: FormControl;
  smn_facebook: FormControl;
  smn_google: FormControl;
  smn_reddit: FormControl;
  smn_bitcointalk: FormControl;
  smn_github: FormControl;
  smn_others: FormControl;
  smn_linkedin: FormControl;
  email: FormControl;
  city: FormControl;
  country: FormControl;
  amountraising: FormControl;
  website: FormControl;
  whitepaper: FormControl;
  shortdescription: FormControl;
  productlink: FormControl;
  icostartdate: FormControl;
  icoenddate: FormControl;
  icocategoryid: FormControl;
  linktoboundry: FormControl;
  tokcenname: FormControl;
  tokeytype: FormControl;
  pricepertoken: FormControl;
  iswhitelistjoined: FormControl;
  createdon: FormControl;
  smn_youtube: FormControl;
  phone_number: FormControl;
  address: FormControl;
  youtubevideolink: FormControl;

  ico: IICO;
  icoform: FormGroup;
  forminitialization: boolean;
  icoGet: IICO;
  imageSrc: string;
  updatedprofileimageurl: string;
  name: string;
  updatedVideoFileName: string;
  ICOCategory: any;
  isDateCompare: boolean;
  ICOStartDate: any;
  ICOEndDate: any;
  submitted: boolean;

  constructor(private icoservice: CompanyService, private fuservice: FileuploadService, private activateRoute: ActivatedRoute,
    private mdservice: MasterDataService, private router: Router, private alertService: AlertCenterService,
    private modalService: NgbModal, private spinner: NgxSpinnerService, private urlservice: UrlparserService) {
    this.activateRoute.queryParams.subscribe(params => {
      this.name = params['name'];
      if (this.name === undefined) {
        this.name = '';
      }
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.updatedVideoFileName = '';
    this.forminitialization = false;
    this.GetICOCategory();
    this.GetICOInfo();
  }

  createFormControls() {
    this.iconame = new FormControl(this.icoGet.iconame, Validators.required);
    this.smn_twitter = new FormControl(this.icoGet.smn_twitter, Utility.isWebsiteValid('smn_twitter'));
    this.smn_facebook = new FormControl(this.icoGet.smn_facebook, Utility.isWebsiteValid('smn_facebook'));
    this.smn_google = new FormControl(this.icoGet.smn_google, Utility.isWebsiteValid('smn_google'));
    this.smn_reddit = new FormControl(this.icoGet.smn_reddit, Utility.isWebsiteValid('smn_reddit'));
    this.smn_bitcointalk = new FormControl(this.icoGet.smn_bitcointalk, Utility.isWebsiteValid('smn_bitcointalk'));
    this.smn_github = new FormControl(this.icoGet.smn_github, Utility.isWebsiteValid('smn_github'));
    this.smn_others = new FormControl(this.icoGet.smn_others, Utility.isWebsiteValid('smn_others'));
    this.smn_linkedin = new FormControl(this.icoGet.smn_linkedin, Utility.isWebsiteValid('smn_linkedin'));
    this.smn_youtube = new FormControl(this.icoGet.smn_youtube, Utility.isWebsiteValid('smn_youtube'));
    this.email = new FormControl(this.icoGet.email, [Validators.required, Utility.isEmailValid('email')]);
    this.city = new FormControl(this.icoGet.city, Validators.nullValidator);
    this.country = new FormControl(this.icoGet.country, Validators.nullValidator);
    this.amountraising = new FormControl(this.icoGet.amountraising, Validators.nullValidator);
    this.website = new FormControl(this.icoGet.website, [Validators.nullValidator, Utility.isWebsiteValid('website')]);
    this.whitepaper = new FormControl(this.icoGet.whitepaper, Utility.isWebsiteValid('whitepaper'));
    this.shortdescription = new FormControl(this.icoGet.shortdescription, Validators.nullValidator);
    this.productlink = new FormControl(this.icoGet.productlink, [Validators.nullValidator, Utility.isWebsiteValid('productlink')]);
    this.icostartdate = new FormControl(this.icoGet.icostartdate, Validators.nullValidator);
    this.icoenddate = new FormControl(this.icoGet.icoenddate, Validators.nullValidator);
    this.icocategoryid = new FormControl(this.icoGet.icocategoryid);
    this.linktoboundry = new FormControl(this.icoGet.linktoboundry, Utility.isWebsiteValid('linktoboundry'));
    this.tokcenname = new FormControl(this.icoGet.tokcenname, Validators.nullValidator);
    this.tokeytype = new FormControl(this.icoGet.tokeytype, Validators.nullValidator);
    this.pricepertoken = new FormControl(this.icoGet.pricepertoken, Validators.nullValidator);
    this.iswhitelistjoined = new FormControl(this.icoGet.iswhitelistjoined);
    this.phone_number = new FormControl(this.icoGet.phone_number, [Validators.required, Validators.maxLength(13),
    Validators.minLength(8), Utility.isPhoneNumberValid('phone_number')]);
    this.address = new FormControl(this.icoGet.address, Validators.nullValidator);
    this.youtubevideolink = new FormControl(this.icoGet.youtubevideolink, Utility.isWebsiteValid('youtubevideolink'));
  }

  createForm() {
    this.icoform = new FormGroup({
      iconame: this.iconame, smn_twitter: this.smn_twitter, smn_facebook: this.smn_facebook, smn_google: this.smn_google,
      smn_reddit: this.smn_reddit, smn_bitcointalk: this.smn_bitcointalk, smn_github: this.smn_github, smn_others: this.smn_others,
      email: this.email, city: this.city, country: this.country, amountraising: this.amountraising, website: this.website,
      whitepaper: this.whitepaper, shortdescription: this.shortdescription, productlink: this.productlink,
      icostartdate: this.icostartdate, icoenddate: this.icoenddate, icocategoryid: this.icocategoryid,
      linktoboundry: this.linktoboundry, tokcenname: this.tokcenname,
      tokeytype: this.tokeytype, pricepertoken: this.pricepertoken, iswhitelistjoined: this.iswhitelistjoined,
      smn_youtube: this.smn_youtube, phone_number: this.phone_number,
      address: this.address, smn_linkedin: this.smn_linkedin, youtubevideolink: this.youtubevideolink
    });
  }

  imgfileChangeEvent(fileInput: any) {
    if (fileInput.target.files[0].type.startsWith('image')) {
      this.filesToUpload = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(fileInput.target.files[0]);
      // uploading user profile image
      const formData: any = new FormData();
      const modifiedfilename = Date.now() + this.filesToUpload.name;
      formData.append('file', this.filesToUpload, modifiedfilename);
      let existingfile = 'xxx';
      if (Utility.isNotEmptyNullUndefined(this.updatedprofileimageurl)) {
        existingfile = this.updatedprofileimageurl;
      }
      this.updatedprofileimageurl = modifiedfilename;
        this.fuservice.UploadFiles(formData, existingfile).subscribe(filename => {
          this.updatedprofileimageurl = filename[0];
          // this.spinner.hide();
        });

    } else {
      this.imageSrc = '../../assets/img/empty_image.png';
      this.alertService.alert(new Alert(AlertType.WARNING, 'please check your profile image format'));
    }
  }

  videofileChangeEvent(fileInput: any) {
    if (fileInput.target.files[0].type.startsWith('video/mp4')) {
      this.videoToUpload = fileInput.target.files[0];
      const formData: any = new FormData();
      const modifiedfilename = Date.now() + this.videoToUpload.name;
      formData.append('file', this.videoToUpload, modifiedfilename);
      let existingfile = 'xxx';
      if (Utility.isNotEmptyNullUndefined(this.updatedVideoFileName)) {
        existingfile = this.updatedVideoFileName;
      }
      this.updatedVideoFileName = modifiedfilename;
        this.fuservice.UploadFiles(formData, existingfile).subscribe(filename => {
          this.updatedVideoFileName = filename.toString();
        });
    } else {
      this.alertService.alert(new Alert(AlertType.WARNING, 'Sorry!! We are not supporting your file format'));
    }
  }

  GetICOCategory() {
    this.mdservice.GetICOCategory().subscribe(ICOCategoryData => {
      this.ICOCategory = ICOCategoryData[0];
    });
  }

  compareTwoDates(): boolean {
    return Datetimeutility.compareTwoDates(this.icoform.controls['icoenddate'].value, this.icoform.controls['icostartdate'].value);
  }

  GetICOInfo() {
    if (!Utility.isNotEmptyNullUndefined(this.name)) {
      this.icoGet = {} as IICO;
      this.AssignProfileImage();
      this.createFormControls();
      this.createForm();
      this.spinner.hide();
      this.forminitialization = true;
    } else {
      this.icoservice.GetICOByName(this.name).subscribe(icoData => {
        this.icoGet = icoData[0][0];
        this.ICOStartDate = this.icoGet.icostartdate;
        this.ICOEndDate = this.icoGet.icoenddate;
        this.AssignProfileImage();
        this.createFormControls();
        this.createForm();
        this.spinner.hide();
        this.forminitialization = true;
      });
    }
  }

  AssignProfileImage() {
    this.urlservice.GetFileURL(this.icoGet.icologoimage, 'icoimage').subscribe(value => {
      this.imageSrc = value;
    });
    this.updatedprofileimageurl = Urlutility.getImageURLforSave(this.icoGet.icologoimage);
  }

  UpdateICO(icoform: FormGroup) {
    if (this.compareTwoDates()) {
      this.alertService.alert(new Alert(AlertType.WARNING, 'ICO start date shoule be less then ICO end date'));
      return;
    }
    if (icoform.valid) {
      // this.spinner.show();
      this.submitted = false;
      const UserData = JSON.parse(localStorage.getItem('UserData'));
      if (UserData !== undefined && UserData !== null) {
        this.ico = {
          iconame: icoform.controls['iconame'].value,
          icologoimage: this.updatedprofileimageurl === undefined ? '' : this.updatedprofileimageurl,
          smn_twitter: icoform.controls['smn_twitter'].value,
          smn_facebook: icoform.controls['smn_facebook'].value,
          smn_google: icoform.controls['smn_google'].value,
          smn_reddit: icoform.controls['smn_reddit'].value,
          smn_bitcointalk: icoform.controls['smn_bitcointalk'].value,
          smn_github: icoform.controls['smn_github'].value,
          smn_others: icoform.controls['smn_others'].value,
          smn_linkedin: icoform.controls['smn_linkedin'].value,
          email: icoform.controls['email'].value,
          city: icoform.controls['city'].value,
          country: icoform.controls['country'].value,
          amountraising: icoform.controls['amountraising'].value,
          website: icoform.controls['website'].value,
          whitepaper: icoform.controls['whitepaper'].value,
          shortdescription: icoform.controls['shortdescription'].value,
          productlink: icoform.controls['productlink'].value,
          videouploadurl: this.updatedVideoFileName === undefined ? '' : this.updatedVideoFileName,
          icostartdate: icoform.controls['icostartdate'].value === '' ? null : icoform.controls['icostartdate'].value,
          icoenddate: icoform.controls['icoenddate'].value === '' ? null : icoform.controls['icoenddate'].value,
          icocategoryid: icoform.controls['icocategoryid'].value,
          linktoboundry: icoform.controls['linktoboundry'].value,
          tokcenname: icoform.controls['tokcenname'].value,
          tokeytype: icoform.controls['tokeytype'].value,
          pricepertoken: icoform.controls['pricepertoken'].value,
          iswhitelistjoined: icoform.controls['iswhitelistjoined'].value,
          smn_youtube: icoform.controls['smn_youtube'].value,
          phone_number: icoform.controls['phone_number'].value,
          long_description: icoform.controls['shortdescription'].value,
          address: icoform.controls['address'].value,
          createdon: new Date(),
          id: 0,
          userid: UserData.id,
          youtubevideolink: icoform.controls['youtubevideolink'].value,
        };

        if (!Utility.isNotEmptyNullUndefined(this.name)) {
          this.icoservice.CreateICO(this.ico).subscribe(returnValue => {
            if (returnValue !== undefined) {
              this.spinner.hide();
              if (returnValue[0] === 'dublicate') {
                this.alertService.alert(new Alert(AlertType.SUCCESS, 'ICO Name is already exist in our system.'));
              } else {
                this.alertService.alert(new Alert(AlertType.SUCCESS, 'ICO has been created!!!'));
                this.router.navigate(['/ICO'], { queryParams: { name: this.ico.iconame } });
              }
            } else {
              this.spinner.hide();
              this.alertService.alert(new Alert(AlertType.DANGER, 'Something went wrong, please try again after some time'));
            }
          });
        } else {
          this.ico.id = this.icoGet.id;
          this.icoservice.UpdateICO(this.ico).subscribe(returnValue => {
            if (returnValue !== undefined) {
              this.spinner.hide();
              if (returnValue[0] === 'dublicate') {
                this.alertService.alert(new Alert(AlertType.SUCCESS, 'ICO Name is already exist in our system.'));
              } else {
                this.alertService.alert(new Alert(AlertType.SUCCESS, 'ICO has been Updated!!!'));
                this.router.navigate(['/ICO'], { queryParams: { name: this.ico.iconame } });
              }
            } else {
              this.spinner.hide();
              this.alertService.alert(new Alert(AlertType.DANGER, 'Something went wrong, please try again after some time'));
            }
          });
        }
      } else {
        this.alertService.alert(new Alert(AlertType.WARNING, 'User details not valid, please login in again'));
      }
    } else {
      this.submitted = true;
      this.alertService.alert(new Alert(AlertType.WARNING, 'Your input is not valid'));
    }
  }
}
