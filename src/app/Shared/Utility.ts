import { environment } from '../../environments/environment';

export class Utility {

    public static timemessage: string = 'Your time is invalid, please check your event time your time should be 24 hours format and format should be 00:00';
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

    public static getMailDataForActivate(activatekey: string, email: string, name: string) {
        const mailData = {
            linktoActivate: environment.AppHostURL + '/Activate?key=' + activatekey + '&&email=' + email,
            userName: name,
            toMailAddress: email
        };
        return mailData;
    }

    public static getMailDataForPassword(activatekey: string, email: string, name: string) {
        const mailData = {
            linktoreset: environment.AppHostURL + '/Forgot?key=' + activatekey + '&&email=' + email,
            userName: name,
            toMailAddress: email
        };
        return mailData;
    }

    public static isNotEmptyNullUndefined(value: string) {
        if (value !== null && value !== '' && value !== ' ' && value !== undefined && value !== 'NaN') {
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
            isinvestor: dbUserData[0].isinvestor,
            type: type,
            ismoderator: dbUserData[0].ismoderator
        };
        const key = 'UserData';
        localStorage.setItem(key, JSON.stringify(userData));
    }

    public static checkCompanyUser(userid: number) {
        const UserData = JSON.parse(localStorage.getItem('UserData'));
        if (UserData !== undefined && UserData !== null) {
            if (UserData.id !== userid) {
                return 0;
            } else {
                return 1;
            }
        }
    }

    public static GenerateLiveStreamCode() {
        return Math.floor(Math.random() * 1000000);
    }
}
