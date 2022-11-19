import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, Subject, takeUntil } from 'rxjs';

import { PermissionType } from '../../../core/models/permission.model';
import { IndexProvider } from '../../../core/models/index.model';
import { indexProviderTableColumns } from './index-provider-table.config';
import { StoreService } from '../../../core/services/store.service';
import { IndexProviderEditDialogComponent } from './index-provider-edit-dialog/index-provider-edit-dialog.component';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';

@Component({
  selector: 'dd-index-provider',
  templateUrl: './index-provider.component.html',
  styleUrls: ['./index-provider.component.scss'],
})
export class IndexProviderComponent implements OnInit, OnDestroy {
  PermissionType = PermissionType;
  columns = indexProviderTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<IndexProvider>([]);

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private store: StoreService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.indexProviders$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((indexProviders) => (this.dataSource.data = indexProviders));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadData() {
    this.store.loadIndexProviders();
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openIndexProviderDialog(this.dataSource.data.find((x) => x.id === obj.id));
    }
  }

  add() {
    this.openIndexProviderDialog();
  }

  private openIndexProviderDialog(indexProvider?: IndexProvider) {
    return this.dialog
      .open(IndexProviderEditDialogComponent, {
        width: '750px',
        data: indexProvider || { id: null },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData());
  }
}
