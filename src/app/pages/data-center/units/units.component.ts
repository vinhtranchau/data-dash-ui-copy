import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, Subject, takeUntil } from 'rxjs';

import { PermissionType } from '../../../core/models/permission.model';
import { Unit } from '../../../core/models/unit.model';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { StoreService } from '../../../core/services/store.service';
import { unitTableColumns } from './units-table.config';
import { UnitEditDialogComponent } from './unit-edit-dialog/unit-edit-dialog.component';

@Component({
  selector: 'dd-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit, OnDestroy {
  PermissionType = PermissionType;
  columns = unitTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<Unit>([]);

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private store: StoreService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.units$.pipe(takeUntil(this.unsubscribeAll)).subscribe((units) => (this.dataSource.data = units));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadData() {
    this.store.loadUnits();
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openUnitDialog(this.dataSource.data.find((x) => x.id === obj.id));
    }
  }

  add() {
    this.openUnitDialog();
  }

  private openUnitDialog(unit?: Unit) {
    return this.dialog
      .open(UnitEditDialogComponent, {
        width: '400px',
        data: unit || { id: null },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData());
  }
}
