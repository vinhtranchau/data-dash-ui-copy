import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, Subject, takeUntil } from 'rxjs';

import { PermissionType } from '../../../core/models/permission.model';
import { Currency } from '../../../core/models/currency.model';
import { StoreService } from '../../../core/services/store.service';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';

import { currencyTableColumns } from './currency-table.config';
import { CurrencyEditDialogComponent } from './currency-edit-dialog/currency-edit-dialog.component';

@Component({
  selector: 'dd-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit, OnDestroy {
  PermissionType = PermissionType;
  columns = currencyTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<Currency>([]);

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private dialog: MatDialog, private store: StoreService) {}

  ngOnInit(): void {
    this.store.currencies$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((currencies) => (this.dataSource.data = currencies));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadData() {
    this.store.loadCurrencies();
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openCurrencyDialog(this.dataSource.data.find((x) => x.id === obj.id));
    }
  }

  add() {
    this.openCurrencyDialog();
  }

  private openCurrencyDialog(currency?: Currency) {
    return this.dialog
      .open(CurrencyEditDialogComponent, {
        width: '400px',
        data: currency || { id: null },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData());
  }
}
