import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpModule } from '@angular/http'; 
import {
  SocialLoginModule, 
  AuthServiceConfig,
  GoogleLoginProvider, 
  FacebookLoginProvider, 
  LinkedinLoginProvider
} from 'angular5-social-auth';

import { Ng2CompleterModule } from "ng2-completer";
import { AppComponent } from './app.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppIcocompanyComponent } from './app-icocompany/app-icocompany.component';
import { AppHomeComponent } from './app-home/app-home.component';
import { AppSigninComponent } from './app-signin/app-signin.component';
import { RegistrationService } from './services/registration.service';  
import { PasswordService } from './services/password.service';
import { AppActivateComponent } from './app-activate/app-activate.component';  
import { EmailService } from './services/email.service';
import { CompanyService } from './services/company.service';
import { MasterDataService } from './services/masterdata.service';
import { FileuploadService } from './services/fileupload.service';
import { AppCompanyComponent } from './app-company/app-company.component';
import { AppCompanylistComponent } from './app-companylist/app-companylist.component';

const appRoutes: Routes = [
  { path: 'Company', component: AppIcocompanyComponent },
  { path: 'SignIn', component: AppSigninComponent },
  { path: 'Home', component: AppCompanylistComponent },
  { path: '', component: AppCompanylistComponent },
  { path: 'Activate', component: AppActivateComponent },
  { path: 'CCompany', component: AppCompanyComponent }
];

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("163948034314248")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("371211842934-rpp5s77rh8vseselpobfbbte6eoqn4rs.apps.googleusercontent.com")
        },
         {
          id: LinkedinLoginProvider.PROVIDER_ID,
          provider: new LinkedinLoginProvider("77abup1pkna5ba")
        },
      ]);
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    AppFooterComponent,
    AppIcocompanyComponent,
    AppHomeComponent,
    AppSigninComponent,
    AppActivateComponent,
    AppCompanyComponent,
    AppCompanylistComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    SocialLoginModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2CompleterModule
  ],
  providers: [RegistrationService,PasswordService,EmailService,CompanyService,MasterDataService,FileuploadService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs,
    }
  ],
  bootstrap: [AppComponent,AppNavbarComponent,AppFooterComponent],
})
export class AppModule  { 
}
