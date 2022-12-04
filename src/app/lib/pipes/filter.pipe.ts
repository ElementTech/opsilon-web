import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'filter',
    pure: false
})
export class Filter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => {
          let matches = true
          for (const key in filter) {
            if (item[key] != filter[key]) {
              matches = false
            }
          }
          return matches
        })
    }
}
