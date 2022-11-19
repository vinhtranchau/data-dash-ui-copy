import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, Subject, takeUntil } from 'rxjs';

import { PermissionType } from '../../../core/models/permission.model';
import { Nation } from '../../../core/models/nation.model';
import { nationTableColumns } from './nation-table.config';
import { StoreService } from '../../../core/services/store.service';
import { NationEditDialogComponent } from './nation-edit-dialog/nation-edit-dialog.component';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';

@Component({
  selector: 'dd-nation',
  templateUrl: './nation.component.html',
  styleUrls: ['./nation.component.scss'],
})
export class NationComponent implements OnInit, OnDestroy {
  PermissionType = PermissionType;
  columns = nationTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<Nation>([]);

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private store: StoreService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.nations$.pipe(takeUntil(this.unsubscribeAll)).subscribe((nations) => (this.dataSource.data = nations));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadData() {
    this.store.loadNations();
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openNationDialog(this.dataSource.data.find((x) => x.id === obj.id));
    }
  }

  add() {
    this.openNationDialog();
  }

  private openNationDialog(nation?: Nation) {
    return this.dialog
      .open(NationEditDialogComponent, {
        width: '400',
        data: nation || { id: null },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData());
  }
}
