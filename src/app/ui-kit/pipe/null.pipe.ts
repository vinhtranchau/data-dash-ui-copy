import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'null',
})
export class NullPipe implements PipeTransform {
  transform(value: any): any {
    if (value === null || value === undefined) {
      return '';
    } else {
      return value;
    }
  }
}
