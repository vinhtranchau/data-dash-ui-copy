import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';

import { PermissionType } from '../../../core/models/permission.model';
import { indexExtensionTableColumns } from './index-extension-table.config';
import { IndexExtensionEditDialogComponent } from './index-extension-edit-dialog/index-extension-edit-dialog.component';
import { ExtendedIndexes } from '../../../core/models/index-extension.model';
import { IndexExtensionService } from '../../../core/services/index-extension.service';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { CommonService } from '../../../core/services/common.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { relativePath } from '../../../core/utils/route.util';
import { standaloneModalRoute } from '../../../core/routes/standalone-modal.route';

@Component({
  selector: 'dd-index-extension',
  templateUrl: './index-extension.component.html',
  styleUrls: ['./index-extension.component.scss'],
})
export class IndexExtensionComponent implements OnInit {
  PermissionType = PermissionType;
  columns = indexExtensionTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<ExtendedIndexes>([]);

  isLoading = true;

  constructor(
    private indexExtensionService: IndexExtensionService,
    private dialog: MatDialog,
    private toast: ToastService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.dataSource.data = await firstValueFrom(this.indexExtensionService.getExtendedIndexes());
    } catch (e) {
      this.toast.error('Failed to load index extensions');
    } finally {
      this.isLoading = false;
    }
  }

  add() {
    this.dialog
      .open(IndexExtensionEditDialogComponent, {
        width: '850px',
        data: { id: null },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData());
  }

  action(obj: TableAction) {
    switch (obj.action) {
      case TableActionType.Download:
        this.downloadIndexExtension(obj.id);
        break;
      case TableActionType.RouterLink:
        this.commonService.openStandaloneModal(
          relativePath([standaloneModalRoute.root, standaloneModalRoute.indexDetails, obj.id, String(0)])
        );
        break;
      default:
        break;
    }
  }

  async downloadIndexExtension(indexDetailsId: string) {
    try {
      const found = this.dataSource.data.find((item) => item.id === indexDetailsId);
      if (!found) {
        return;
      }
      await firstValueFrom(
        this.indexExtensionService.downloadIndexExtension(
          indexDetailsId,
          `Index_Extension__${found.index_details_id__stable_index_code}`
        )
      );
    } catch (e) {
      this.toast.error('Failed to download index extension.');
    } finally {
    }
  }
}
