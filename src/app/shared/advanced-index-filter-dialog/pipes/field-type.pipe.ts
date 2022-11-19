import { Pipe, PipeTransform } from '@angular/core';

import { FieldOption, FieldType } from '../advanced-index-filter-dialog.model';
import { getFieldType } from '../advanced-index-filter-dialog.util';

@Pipe({
  name: 'fieldType',
})
export class FieldTypePipe implements PipeTransform {
  transform(fieldId: string, fieldOptions: FieldOption[]): FieldType {
    return getFieldType(fieldId, fieldOptions);
  }
}
