import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';

import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { User } from '../../../core/models/user.model';
import { PermissionType } from '../../../core/models/permission.model';
import { userTableColumns } from './users-table.config';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'dd-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  PermissionType = PermissionType;
  dataSource = new MatTableDataSource<User>([]);
  columns = userTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  selectedId: string | null;

  total = 0;
  isLoading = true;

  constructor(
    private usersService: UserService,
    private dialog: MatDialog,
    private toast: ToastService,
    private route: ActivatedRoute,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.selectedId = id || null;
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.dataSource.data = await firstValueFrom(this.usersService.getUsers());
      if (this.selectedId) {
        this.openUserDialog(this.selectedId);
        this.selectedId = null; // Only open on initial page load
      }
    } catch (e) {
      this.toast.error('Failed to load users');
    } finally {
      this.isLoading = false;
    }
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openUserDialog(obj.id);
    }
  }

  openUserDialog(id: string) {
    if (this.roleService.getPermissionLevel(PermissionType.UsersTable) >= 2) {
      const user = this.dataSource.data.find((x) => x.id.toString() === id.toString());
      if (user) {
        this.dialog
          .open(UserEditDialogComponent, {
            width: '650px',
            data: user,
            panelClass: 'rootModal',
          })
          .afterClosed()
          .pipe(filter((res) => res))
          .subscribe(() => this.loadData());
      }
    }
  }
}
