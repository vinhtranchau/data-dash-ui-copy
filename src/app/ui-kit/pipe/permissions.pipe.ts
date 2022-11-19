import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissions',
})
export class PermissionsPipe implements PipeTransform {
  transform(value: number, ...args: string[]): string {
    if (value === 2) {
      return 'Edit';
    } else if (value === 1) {
      return 'View';
    } else {
      return ' - ';
    }
  }
}
