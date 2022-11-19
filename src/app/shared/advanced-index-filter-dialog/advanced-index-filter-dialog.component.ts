import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, merge, Subject, takeUntil } from 'rxjs';

import { ToastService } from '../../ui-kit/toast/toast.service';
import {
  AggregateMethod,
  aggregateMethodOptions,
  FieldOption,
  FieldType,
  SearchBy,
} from './advanced-index-filter-dialog.model';
import {
  IndexFilter,
  IndexFilterForm,
  IndexFilterItem,
  IndexFilterItemForm,
  indexFilterItemFormGroupBuilder,
} from './advanced-index-filter-dialog.form';
import { booleanOptions } from '../../core/models/option.model';
import { getFieldType } from './advanced-index-filter-dialog.util';

@Component({
  selector: 'dd-advanced-index-filter-dialog',
  templateUrl: './advanced-index-filter-dialog.component.html',
  styleUrls: ['./advanced-index-filter-dialog.component.scss'],
})
export class AdvancedIndexFilterDialogComponent implements OnInit, OnDestroy {
  aggregateMethodOptions = aggregateMethodOptions;
  booleanOptions = booleanOptions;
  FieldType = FieldType;

  indexFieldOptions: FieldOption[] = [];
  form: FormGroup<IndexFilterForm> = this.fb.nonNullable.group({
    filters: this.fb.nonNullable.array<FormGroup<IndexFilterItemForm>>([]),
    aggregate_method: [AggregateMethod.MatchAll],
  });

  private unsubscribeFieldChanges: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdvancedIndexFilterDialogComponent>,
    private toast: ToastService,
    @Inject(MAT_DIALOG_DATA) private data: { indexFilter: IndexFilter; fieldOptions: FieldOption[] }
  ) {
    this.indexFieldOptions = data.fieldOptions;
  }

  ngOnInit(): void {
    this.buildForm();
    this.watchFilterFieldChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribeFieldChanges.next(null);
    this.unsubscribeFieldChanges.complete();
  }

  addFilter(filter?: IndexFilterItem) {
    const data = indexFilterItemFormGroupBuilder(filter || { field: null, search_term: null, search_by: null });
    this.form.controls.filters.push(this.fb.nonNullable.group({ ...data }));
    this.watchFilterFieldChanges();
  }

  clearFilters() {
    this.form.controls.filters.clear();
    this.watchFilterFieldChanges();
  }

  removeFilter(index: number) {
    this.form.controls.filters.removeAt(index);
    this.watchFilterFieldChanges();
  }

  save() {
    if (this.form.invalid) {
      const filters = this.form.value.filters;
      if (!filters || filters.length !== 1) {
        this.toast.error('Filter is invalid and cannot be saved.');
      }
      if (filters?.length === 1) {
        const { field, search_term, search_by } = filters[0];
        if (!field && !search_by && !search_term) {
          // Return just empty filter object
          this.dialogRef.close({ filters: [], aggregate_method: AggregateMethod.MatchAll });
        } else {
          this.toast.error('Filter is invalid and cannot be saved.');
        }
      }
    } else {
      this.dialogRef.close(this.form.value);
    }
  }

  private watchFilterFieldChanges() {
    this.unsubscribeFieldChanges.next(null);
    merge(
      ...this.form.controls.filters.controls.map((control) =>
        control.controls.field.valueChanges.pipe(
          map((field) => ({ field, group: control })),
          takeUntil(this.unsubscribeFieldChanges)
        )
      )
    ).subscribe(({ field, group }) => {
      const type = getFieldType(field || '', this.indexFieldOptions);
      // To clear search_term when field is changed
      if (type === FieldType.Enum || type == FieldType.Boolean) {
        group.controls.search_term.setValue([]);
      } else {
        group.controls.search_term.setValue(null);
      }
      const searchByControl = group.controls.search_by;
      if (type === FieldType.Enum || type === FieldType.Boolean) {
        searchByControl.setValue(SearchBy.Exact);
      } else if (type === FieldType.String) {
        searchByControl.setValue(SearchBy.Contains);
      } else if (type === FieldType.Number) {
        searchByControl.setValue(SearchBy.GreaterThan);
      }
    });
  }

  private buildForm() {
    if (!this.data) {
      return;
    }

    this.form.controls.aggregate_method.setValue(this.data.indexFilter.aggregate_method);
    this.data.indexFilter.filters.forEach((filter) => this.addFilter(filter));
  }
}
