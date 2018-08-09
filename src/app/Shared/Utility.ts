import { environment } from '../../environments/environment';

export class Utility {

    updatedImageUrl: string;

    public static isEmailValid(control) {
        return control => {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(control.value) ? null : { invalidEmail: true };
        };
    }

    public static isWebsiteValid(control) {
        return control => {
            const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            return regex.test(control.value) || !this.isNotEmptyNullUndefinedforValidation(control.value) ? null : { invalidWebSite: true };
        };
    }

    public static isPhoneNumberValid(control) {
        return control => {
            const regex = /^[0-9]*$/;
            return regex.test(control.value) || !this.isNotEmptyNullUndefinedforValidation(control.value) ? null : { invalidPhone: true };
        };
    }

    public static getMailData(activatekey: string, email: string, name: string) {
        const mailData = {
            linktoActivate: environment.AppHostURL + '/Activate?key=' + activatekey + '&&email=' + email,
            userName: name,
            toMailAddress: email
          };
          return mailData;
    }

    public static compareTwoDates(startDate: Date, endDate: Date): boolean {
        if (new Date(startDate) < new Date(endDate)) {
            return true;
        } else {
            return false;
        }
    }

    public static isNotEmptyNullUndefined(value: string) {
        if (value !== null && value !== '' && value !== ' ' && value !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    public static isNotEmptyNullUndefinedforValidation(value: string) {
        if (value !== null && value !== '' && value !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    public static getImageURL(imageUrl: string) {
        if (this.isNotEmptyNullUndefined(imageUrl)) {
            if (imageUrl.indexOf('http') === -1) {
                return environment.ApiHostURL + 'static/companyimages/' + imageUrl;
            } else {
                return imageUrl;
            }
        } else {
            return '../../assets/img/empty_image.png';
        }
    }

    public static getUserImageURL(imageUrl: string) {
        if (this.isNotEmptyNullUndefined(imageUrl)) {
            if (imageUrl.indexOf('http') === -1) {
                return environment.ApiHostURL + 'static/companyimages/' + imageUrl;
            } else {
                return imageUrl;
            }
        } else {
            return '../../assets/img/ico-user.png';
        }
    }

    public static getImageURLforSave(imageUrl: string) {
        if (this.isNotEmptyNullUndefined(imageUrl)) {
            return imageUrl;
        } else {
            return '';
        }
    }

    public static getDiferenceInDays(theDate: string): number {
        if (this.isNotEmptyNullUndefined(theDate)) {
            const newDate = new Date(theDate);
            return Math.round(Math.abs((newDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
        }
    }

    public static AssignLogomage(icoImage: string): string {
        if (this.isNotEmptyNullUndefined(icoImage)) {
            return environment.ApiHostURL + 'static/companyimages/' + icoImage;
        } else {
            return '../../assets/img/icoimagecard.jpg';
        }
    }

    public static generatingActivateKey() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    public static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    public static assignLocalStorageData(dbUserData, type) {
        const userData = {
          name: dbUserData[0].name,
          email: dbUserData[0].email,
          image: dbUserData[0].profileimageurl,
          id: dbUserData[0].id,
          type: type,
          ismoderator: dbUserData[0].ismoderator
        };
        const key = 'UserData';
        localStorage.setItem(key, JSON.stringify(userData));
      }
}
