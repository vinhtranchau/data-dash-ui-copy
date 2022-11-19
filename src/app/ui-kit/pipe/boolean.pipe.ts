import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean',
})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean | null, ...args: string[]): string {
    if (value) {
      return 'Yes';
    } else if (!value) {
      return 'No';
    } else {
      return '';
    }
  }
}
