import { Pipe, PipeTransform } from '@angular/core';
import { getDecimal } from '../../core/utils/number.util';

@Pipe({
  name: 'getDecimal',
})
export class GetDecimalPipe implements PipeTransform {
  transform(value: any, decimalPlaces: number = 4): string {
    return getDecimal(value, decimalPlaces); // Using this because it handles non-number values (strings)
  }
}
