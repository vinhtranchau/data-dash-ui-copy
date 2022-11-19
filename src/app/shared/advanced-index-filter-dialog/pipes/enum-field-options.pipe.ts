import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FieldOption, FieldType } from '../advanced-index-filter-dialog.model';
import { booleanOptions, Option } from '../../../core/models/option.model';

@Pipe({
  name: 'enumFieldOptions',
})
export class EnumFieldOptionsPipe implements PipeTransform {
  transform(fieldId: string, fieldOptions: FieldOption[]): Observable<Option[]> {
    const field = fieldOptions.find((option) => option.id === fieldId);
    if (field) {
      if (field.type === FieldType.Enum) {
        if (field.asyncOptions$) {
          return field.asyncOptions$;
        } else {
          return of(field.options || []);
        }
      } else if (field.type === FieldType.Boolean) {
        // NOTE: Returning boolean options, but mostly will be handled on the html side manually
        return of(booleanOptions);
      }
      return of([]);
    }
    return of([]);
  }
}
