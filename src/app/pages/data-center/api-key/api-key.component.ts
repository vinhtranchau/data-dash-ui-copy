import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { filter, firstValueFrom } from 'rxjs';
import { ApiKey } from '../../../core/models/api-key.model';
import { PermissionType } from '../../../core/models/permission.model';
import { ApiKeyService } from '../../../core/services/api-key.service';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { ApiKeyEditDialogComponent } from './api-key-edit-dialog/api-key-edit-dialog.component';
import { apiKeyTableColumns } from './api-key-table.config';

@Component({
  selector: 'dd-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.scss'],
})
export class ApiKeyComponent implements OnInit {
  PermissionType = PermissionType;
  columns = apiKeyTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<ApiKey>([]);

  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private clipboard: Clipboard,
    private apiKeyService: ApiKeyService
  ) {}

  ngOnInit(): void {}

  async loadData() {
    try {
      this.isLoading = true;
      let results = await firstValueFrom(this.apiKeyService.getApiKeys());
      results = results.map((apiKey) => ({
        ...apiKey,
        permission_count: apiKey.permissions?.length,
      }));
      this.dataSource.data = results;
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openApiKeyDialog(this.dataSource.data.find((x) => x.id === obj.id));
    } else if (obj.action === TableActionType.ContentPaste) {
      this.clipboard.copy(obj.id);
      this.toast.success('API Key copied to clipboard');
    }
  }

  add() {
    this.openApiKeyDialog();
  }

  private openApiKeyDialog(apiKey?: ApiKey) {
    return this.dialog
      .open(ApiKeyEditDialogComponent, {
        width: '700px',
        data: apiKey || { id: null },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData());
  }
}
