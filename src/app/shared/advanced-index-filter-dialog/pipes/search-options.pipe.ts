import { Pipe, PipeTransform } from '@angular/core';

import { Option } from '../../../core/models/option.model';
import {
  FieldOption,
  FieldType,
  searchByExactOptions,
  searchByNumberOptions,
  searchByOptions,
} from '../advanced-index-filter-dialog.model';
import { getFieldType } from '../advanced-index-filter-dialog.util';

@Pipe({
  name: 'searchOptions',
})
export class SearchOptionsPipe implements PipeTransform {
  transform(fieldId: string, fieldOptions: FieldOption[]): Option[] {
    const type = getFieldType(fieldId, fieldOptions);
    if (type === FieldType.Enum || type == FieldType.Boolean) {
      return searchByExactOptions;
    } else if (type === FieldType.Number) {
      return searchByNumberOptions;
    } else {
      return searchByOptions;
    }
  }
}
