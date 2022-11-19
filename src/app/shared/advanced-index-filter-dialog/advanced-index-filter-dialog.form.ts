import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AggregateMethod } from './advanced-index-filter-dialog.model';

export interface IndexFilterItemForm {
  field: FormControl<any>;
  search_by: FormControl<any>;
  search_term: FormControl<any>; // NOTE: This can be string, string[], boolean, or null
}

export interface IndexFilterForm {
  filters: FormArray<FormGroup<IndexFilterItemForm>>;
  aggregate_method: FormControl<AggregateMethod>;
}

export interface IndexFilterItem {
  field: string | null;
  search_by: string | null;
  search_term: string | string[] | boolean | null;
}

export interface IndexFilter {
  filters: IndexFilterItem[];
  aggregate_method: AggregateMethod;
}

export function indexFilterItemFormGroupBuilder(data: IndexFilterItem) {
  return {
    field: [data.field, Validators.required],
    search_by: [data.search_by, Validators.required],
    search_term: [data.search_term],
  };
}

export interface SearchEmit {
  searchTerm: string;
  indexFilter?: IndexFilter;
}
