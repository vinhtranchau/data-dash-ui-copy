import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, Observable, tap } from 'rxjs';

import { INDEX_FIELD_OPTIONS } from './factories/index-field-options.factory';
import { INDEX_FIELD_CORRELATION_OPTIONS } from './factories/index-field-correlation-options.factory';

import { AggregateMethod, FieldOption } from './advanced-index-filter-dialog.model';
import { IndexFilter } from './advanced-index-filter-dialog.form';
import { StoreService } from '../../core/services/store.service';
import { AdvancedIndexFilterDialogComponent } from './advanced-index-filter-dialog.component';

@Injectable()
export class AdvancedIndexFilterDialogService {
  indexFilter: IndexFilter = { filters: [], aggregate_method: AggregateMethod.MatchAll };
  indexFieldOptions: FieldOption[] = [];
  indexFieldCorrelationOptions: FieldOption[] = [];

  constructor(
    private store: StoreService,
    private dialog: MatDialog,
    // NOTE: Additional field options can be injected here and handled by the function
    //  Create a new function for different field options. Feel free to change the name of the factory
    @Inject(INDEX_FIELD_OPTIONS) indexFieldOptions: FieldOption[],
    @Inject(INDEX_FIELD_CORRELATION_OPTIONS) indexFieldCorrelationOptions: FieldOption[]
  ) {
    this.indexFieldOptions = indexFieldOptions;
    this.indexFieldCorrelationOptions = [...indexFieldOptions, ...indexFieldCorrelationOptions];
    this.store.loadUnits();
    this.store.loadNations();
    this.store.loadCurrencies();
    this.store.loadHierarchies();
    this.store.loadClasses();
    this.store.loadGroups();
    this.store.loadKingdoms();
    this.store.loadIndexProviders();
    this.store.loadIndexUUIDs();
  }

  resetFilterDialog() {
    this.indexFilter = { filters: [], aggregate_method: AggregateMethod.MatchAll };
  }

  openIndexFilterDialog(): Observable<IndexFilter> {
    return this.dialog
      .open(AdvancedIndexFilterDialogComponent, {
        width: '800px',
        data: { indexFilter: this.indexFilter, fieldOptions: this.indexFieldOptions },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(
        filter((res) => res),
        tap((indexFilter) => (this.indexFilter = indexFilter))
      );
  }

  openIndexCorrelationFilterDialog(): Observable<IndexFilter> {
    return this.dialog
      .open(AdvancedIndexFilterDialogComponent, {
        width: '800px',
        data: { indexFilter: this.indexFilter, fieldOptions: this.indexFieldCorrelationOptions },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(
        filter((res) => res),
        tap((indexFilter) => (this.indexFilter = indexFilter))
      );
  }
}
