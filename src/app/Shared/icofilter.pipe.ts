import { Pipe, PipeTransform } from '@angular/core';
import {  SharedService} from '../services/shared.service';

@Pipe({
  name: 'icofilter',
})
export class IcofilterPipe implements PipeTransform {

  icolistdata: any;

  constructor(private sharedservice: SharedService) {
    this.sharedservice.icolistdata$.subscribe(icodata => {
      this.icolistdata = icodata;
    });
  }

  transform(items: any[], filter: string): any {
    if (!this.icolistdata || !filter || !items) {
      return items;
    }
    return this.icolistdata.filter(item => item.iconame.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
}
