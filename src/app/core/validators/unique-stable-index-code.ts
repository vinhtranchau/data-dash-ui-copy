import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { first, map, Observable } from 'rxjs';

import { StoreService } from '../services/store.service';

export class uniqueStableIndexCode {
  static createValidator(store: StoreService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return store.indexUUIDs$.pipe(
        first(),
        map((uuids) =>
          uuids.map((uuid) => uuid.stable_index_code).includes(control.value.toUpperCase())
            ? { stableIndexCodeExists: true }
            : null
        )
      );
    };
  }
}
