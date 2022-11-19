import { Pipe, PipeTransform } from '@angular/core';
import { getPercentage } from '../../core/utils/number.util';

@Pipe({
  name: 'percentageChange',
})
export class PercentageChangePipe implements PipeTransform {
  transform(value: number | string, decimalPlaces = 2, positiveSign = true): string {
    return getPercentage(value, decimalPlaces, positiveSign);
  }
}
