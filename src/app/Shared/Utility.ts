import { environment } from '../../environments/environment';
import { IICOList } from '../core/Model/IICOList';

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

    public static GenerateLiveStreamCode() {
        return Math.floor(Math.random() * 1000000);
    }

    public static getDayString(day) {
        if (day === 1 || day === 21 || day === 31) {
            return 'st';
        } else if (day === 2 || day === 22) {
            return 'nd';
        } else if (day === 3 || day === 23) {
            return 'rd';
        } else {
            return 'th';
        }
    }

    public static livestreamdatetimeconversion(livestreamdate, time) {
        const date = new Date(livestreamdate);
        const day = this.getDayString(date.getDate());
        const locale = 'en-us';
        const month = date.toLocaleString(locale, { month: 'long' });
        const hourminutes = this.formatAMPM(time);
        const datetime = date.getDate() + day + ', ' + month + ' - ' + hourminutes;
        return datetime;
    }

    public static formatAMPM(time) {
        let hours = time.split(':')[0];
        let minutes = time.split(':')[1];
        if (minutes === undefined) {
            minutes = 0;
        }
        const ampm = hours >= 12 ? 'Pm' : 'Am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + 'h' + minutes + ampm;
        return strTime;
    }

    public static validateTime(timeValue) {
        let timeoutput: string;
        if (parseInt(timeValue, 10) !== NaN) {
            timeValue = timeValue + ':00';
        }
        if (timeValue === '' || timeValue.indexOf(':') < 0) {
            timeoutput = 'false';
        } else {
            let sHours = timeValue.split(':')[0];
            let sMinutes = timeValue.split(':')[1];

            if (sHours === '' || isNaN(sHours) || parseInt(sHours, 10) > 23) {
                timeoutput = 'false';
            } else if (parseInt(sHours, 10) === 0) {
                sHours = '00';
            } else if (parseInt(sHours, 10) < 10) {
                sHours = '0' + sHours;
            }
            if (sMinutes === '' || isNaN(sMinutes) || parseInt(sMinutes, 10) > 59) {
                timeoutput = 'false';
            } else if (parseInt(sMinutes, 10) === 0) {
                sMinutes = '00';
            } else if (parseInt(sMinutes, 10) < 10) {
                sMinutes = '0' + sMinutes;
            }
            if (timeoutput !== 'false') {
                timeoutput = sHours + ':' + sMinutes;
            }
        }
        return timeoutput;
    }

    public static getHours(timeValue) {
        return parseInt(timeValue.split(':')[0], 10);
    }

    public static getMinutes(timeValue) {
        return parseInt(timeValue.split(':')[1], 10);
    }

    public static ICOSorting(icolist: IICOList[], isliveStramDateavailale: boolean) {
        const returnList: IICOList[] = [];
        if (icolist.length > 0) {
            if (isliveStramDateavailale) {
                icolist.sort(function (a, b) {
                    const dateA: any = new Date(a.livestreamdate), dateB: any = new Date(b.livestreamdate);
                    return dateA - dateB;
                });
            }
            icolist.map(data => {
                if (returnList !== undefined) {
                    const pushdata = returnList.find(x => x.id === data.id);
                    if (pushdata === undefined) {
                        returnList.push(data);
                    }
                } else {
                    returnList.push(data);
                }
            });
        }
        return returnList;
    }
}
