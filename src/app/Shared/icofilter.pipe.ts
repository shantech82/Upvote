import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icofilter'
})
export class IcofilterPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
        return items;
    }
    return items.filter(item => item.iconame.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
}
}
