import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { filter, map } from 'rxjs';

import { StoreService } from '../../../../../core/services/store.service';
import { uniqueStableIndexCode } from '../../../../../core/validators/unique-stable-index-code';
import { Index } from '../../../../../core/models/index.model';

@Component({
  selector: 'dd-index-specification-form',
  templateUrl: './index-specification-form.component.html',
  styleUrls: ['./index-specification-form.component.scss'],
})
export class IndexSpecificationFormComponent implements OnInit {
  @Input() form: UntypedFormGroup;
  @Input() index: Index | null;

  hierarchies$ = this.store.hierarchies$.pipe(
    map((hierarchies) =>
      hierarchies.map((hierarchy) => ({
        ...hierarchy,
        hierarchy_chain: `${hierarchy?.name} -> ${hierarchy?.class_hierarchy_id?.name} -> ${hierarchy?.class_hierarchy_id?.group_hierarchy_id?.name} -> ${hierarchy?.class_hierarchy_id?.group_hierarchy_id?.kingdom_hierarchy_id?.name}`,
      }))
    )
  );
  units$ = this.store.units$;
  nations$ = this.store.nations$;
  currencies$ = this.store.currencies$;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    if (!this.index) {
      // NOTE: When this is edit, then stable_index_code should be validated as unique
      this.form.get('stable_index_code')?.addAsyncValidators(uniqueStableIndexCode.createValidator(this.store));
    } else {
      // NOTE: When this is edit, then stable_index_code should be readonly
      this.form.get('stable_index_code')?.disable();
    }
  }
}
