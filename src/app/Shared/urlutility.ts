import { Utility } from './Utility';
import { Datetimeutility } from './datetimeutility';
import { environment } from '../../environments/environment';
import { IliveStreamCalendar } from '../core/Model/ILiveStream';

export class Urlutility {
    public static getFileURL(fileUrl: string, type: string, status: boolean) {
        if (status && Utility.isNotEmptyNullUndefined(fileUrl)) {
            if (fileUrl.indexOf('http') === -1) {
                return environment.ApiHostURL + 'static/' + fileUrl;
            } else {
                return fileUrl;
            }
        } else {
            if (fileUrl && fileUrl.indexOf('http') !== -1) {
                return fileUrl;
            } else if (type === 'icovideo') {
                return undefined;
            } else if (type === 'icouser') {
                return '../../assets/img/ico-user.png';
            } else {
                return '../../assets/img/empty_image.png';
            }
        }
    }

    public static getAPIFileURL(fileUrl: string) {
        return environment.ApiHostURL + 'static/' + fileUrl;
    }

    public static getImageURLforSave(imageUrl: string) {
        if (Utility.isNotEmptyNullUndefined(imageUrl)) {
            return imageUrl;
        } else {
            return '';
        }
    }

    public static GetYoutubeVideo(videoURL: string) {
        if (Utility.isNotEmptyNullUndefined(videoURL)) {
            return videoURL.replace('watch?v=', 'embed/');
        }
        return undefined;
    }

    public static frameCalendarURL(livestreamcalendar: IliveStreamCalendar, typeOfCalendar: string) {
        let calendarURL: string;
        if (typeOfCalendar === 'google') {
            calendarURL = this.googleCalendarURL(livestreamcalendar);
        } else if (typeOfCalendar === 'yahoo') {
            calendarURL = this.yahooCalendarURL(livestreamcalendar);
        } else if (typeOfCalendar === 'microsoft') {
            calendarURL = this.microsoftCalendarURL(livestreamcalendar);
        }
        return calendarURL;
    }

    public static googleCalendarURL(livestreamcalendar: IliveStreamCalendar) {
        return 'http://www.google.com/calendar/event?action=TEMPLATE&dates=' +
        Datetimeutility.GetDateTimeFormat(livestreamcalendar.startdate, livestreamcalendar.hours,
            livestreamcalendar.minutes, 0) + '/' +
        Datetimeutility.GetDateTimeFormat(livestreamcalendar.startdate, livestreamcalendar.hours,
            livestreamcalendar.minutes, 2) + '&text=' +
            livestreamcalendar.title + '&location=' + livestreamcalendar.location + '&details=' + livestreamcalendar.description;
    }

    public static yahooCalendarURL(livestreamcalendar: IliveStreamCalendar) {
        return 'http://calendar.yahoo.com/?v=60&TITLE=' + livestreamcalendar.title + '&DESC=' + livestreamcalendar.description + '&ST=' +
        Datetimeutility.GetDateTimeFormat(livestreamcalendar.startdate, livestreamcalendar.hours, livestreamcalendar.minutes, 0) +
            '&DUR=0200&in_loc=' + livestreamcalendar.location + '&TYPE=21';
    }

    public static microsoftCalendarURL(livestreamcalendar: IliveStreamCalendar) {
        return 'http://calendar.live.com/calendar/calendar.aspx?rru=addevent&summary=' + livestreamcalendar.title +
            'dtstart=' + Datetimeutility.GetDateTimeFormat(livestreamcalendar.startdate, livestreamcalendar.hours,
                livestreamcalendar.minutes, 0) +
            '&dtend=' + Datetimeutility.GetDateTimeFormat(livestreamcalendar.startdate, livestreamcalendar.hours,
                livestreamcalendar.minutes, 2) +
            '&description=' + livestreamcalendar.title + '&location=' + livestreamcalendar.location;
    }
}
