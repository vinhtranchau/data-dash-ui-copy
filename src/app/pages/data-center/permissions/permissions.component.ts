import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom, map } from 'rxjs';

import { Permission, PermissionType } from '../../../core/models/permission.model';
import { PermissionService } from '../../../core/services/permission.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { permissionTableColumns } from './permissions-table.config';
import { PermissionEditDialogComponent } from './permission-edit-dialog/permission-edit-dialog.component';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';

@Component({
  selector: 'dd-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
  PermissionType = PermissionType;
  columns = permissionTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<Permission>([]);

  isLoading = true;

  constructor(private permissionService: PermissionService, private dialog: MatDialog, private toast: ToastService) {
  }

  ngOnInit(): void {
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.dataSource.data = await firstValueFrom(this.permissionService.getPermissions());
    } catch (e) {
      this.toast.error('Failed to load permission groups.');
    } finally {
      this.isLoading = false;
    }
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openPermissionDialog(this.dataSource.data.find((x) => x.id === obj.id));
    }
  }

  add() {
    this.openPermissionDialog();
  }

  private openPermissionDialog(permission?: Permission) {
    return this.dialog
      .open(PermissionEditDialogComponent, {
        width: '900px',
        data: permission || { id: null },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData());
  }
}
