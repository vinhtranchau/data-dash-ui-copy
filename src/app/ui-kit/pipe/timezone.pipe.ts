import { Pipe, PipeTransform } from '@angular/core';
import { addTimezone } from '../../core/utils/dates.util';

@Pipe({
  name: 'timezone',
})
export class TimeZonePipe implements PipeTransform {
  transform(value: Date): Date {
    if (value) {
      return addTimezone(value);
    } else {
      return value;
    }
  }
}
