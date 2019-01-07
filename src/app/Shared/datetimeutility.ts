import { Utility } from './Utility';

export class Datetimeutility {

    public static compareTwoDates(startDate: Date, endDate: Date): boolean {
        if (new Date(startDate) < new Date(endDate)) {
            return true;
        } else {
            return false;
        }
    }

    public static getDiferenceInDays(theDate: string): number {
        if (Utility.isNotEmptyNullUndefined(theDate)) {
            const newDate = new Date(theDate);
            if (newDate.getTime() >= new Date().getTime()) {
                return Math.round(Math.abs((newDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
            }
        }
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
        if (Utility.isNotEmptyNullUndefined(timeValue.split(':')[0])) {
            return parseInt(timeValue.split(':')[0], 10);
        } else {
            return 0;
        }
    }

    public static getMinutes(timeValue) {
        if (Utility.isNotEmptyNullUndefined(timeValue.split(':')[1])) {
            return parseInt(timeValue.split(':')[1], 10);
        } else {
            return 0;
        }
    }

    public static GetDateTimeFormat(inputdate, hours, minutes, addHours) {
        const x = new Date(inputdate);
        const y = x.getFullYear().toString();
        let m = (x.getMonth() + 1).toString();
        let d = x.getDate().toString();
        if (d.length === 1) {
            (d = '0' + d);
        }
        if (m.length === 1) {
            (m = '0' + m);
        }
        if (addHours > 0) {
            if (hours === 22 || hours === null) {
                hours = 0;
            } else if (hours === 23) {
                hours = 1;
            } else {
                hours = hours + addHours;
            }
        }

        let h = hours.toString();
        if (!Utility.isNotEmptyNullUndefined(h)) {
            h = '00';
        } else if (h.length === 1) {
            (h = '0' + h);
        }

        let mn = minutes.toString();
        if (!Utility.isNotEmptyNullUndefined(mn)) {
            mn = '00';
        } else if (mn.length === 1) {
            (mn = '0' + mn);
        }
        return y + m + d + 'T' + h + mn + '00Z';
    }
}
