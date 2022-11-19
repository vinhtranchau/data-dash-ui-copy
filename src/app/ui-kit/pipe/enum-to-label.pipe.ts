import { Pipe, PipeTransform } from '@angular/core';

import { enumToLabel } from '../../core/utils/enum.util';

@Pipe({
  name: 'enumToLabel',
})
export class EnumToLabelPipe implements PipeTransform {
  transform(value: string, labelOptions?: { [key: string]: string }): string {
    return enumToLabel(value, labelOptions);
  }
}
