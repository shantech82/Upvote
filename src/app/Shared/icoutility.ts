import { IICOList } from '../core/Model/IICOList';
import { Datetimeutility } from './datetimeutility';

export class Icoutility {
    public static livestreamdatetimeconversion(livestreamdate, time) {
        const date = new Date(livestreamdate);
        const day = Datetimeutility.getDayString(date.getDate());
        const locale = 'en-us';
        const month = date.toLocaleString(locale, { month: 'long' });
        const hourminutes = Datetimeutility.formatAMPM(time);
        const datetime = date.getDate() + day + ', ' + month + ' - ' + hourminutes;
        return datetime;
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
