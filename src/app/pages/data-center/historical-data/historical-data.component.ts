import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';

import { PermissionType } from '../../../core/models/permission.model';
import { historicalDataTableColumns } from './historical-data-table.config';
import { TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { CommonService } from '../../../core/services/common.service';
import { relativePath } from '../../../core/utils/route.util';
import { standaloneModalRoute } from '../../../core/routes/standalone-modal.route';
import { HistoricalDataIndexes } from '../../../core/models/historical-data.model';
import { HistoricalDataService } from '../../../core/services/historical-data.service';
import { HistoricalDataEditDialogComponent } from './historical-data-edit-dialog/historical-data-edit-dialog.component';
import { StoreService } from '../../../core/services/store.service';
import { DialogService } from '../../../ui-kit/dialog/dialog.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-historical-data',
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.scss'],
})
export class HistoricalDataComponent implements OnInit {
  PermissionType = PermissionType;
  columns = historicalDataTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<HistoricalDataIndexes>([]);

  isLoading = true;

  constructor(
    private historicalDataService: HistoricalDataService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private toast: ToastService,
    private commonService: CommonService,
    private store: StoreService
  ) {
  }

  ngOnInit(): void {
    this.store.loadIndexUUIDs();
    this.store.loadDISpiders();
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.dataSource.data = await firstValueFrom(this.historicalDataService.getHistoricalDataIndexes());
    } catch (e) {
      this.toast.error('Failed to load historical data');
    } finally {
      this.isLoading = false;
    }
  }

  add() {
    this.dialog
      .open(HistoricalDataEditDialogComponent, {
        width: '1100px',
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
        this.downloadHistoricalData(obj.id);
        break;
      case TableActionType.Delete:
        this.deleteHistoricalData(obj.id);
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

  async downloadHistoricalData(indexDetailsId: string) {
    try {
      const found = this.dataSource.data.find((item) => item.id === indexDetailsId);
      if (!found) {
        return;
      }
      await firstValueFrom(
        this.historicalDataService.downloadHistoricalData(
          indexDetailsId,
          `Historical_Data__${found.index_details_id__stable_index_code}`
        )
      );
    } catch (e) {
      this.toast.error('Failed to download historical data.');
    } finally {
    }
  }

  async deleteHistoricalData(indexDetailsId: string) {
    const data = this.dataSource.data.find((x) => x.id === indexDetailsId);

    if (!data) {
      return;
    }

    this.dialogService
      .confirm(
        'Delete Historical Data',
        `
            <div class="bg-honey text-14 text-white px-15 py-10 rounded shadow mb-20"> <b>WARNING</b>: This will delete all historical data of ${data.index_details_id__stable_index_code}. </div>
        `
      )
      .then(async (confirm) => {
        if (!confirm) {
          return;
        }
        try {
          this.isLoading = true;
          await firstValueFrom(this.historicalDataService.deleteHistoricalDataIndexes(indexDetailsId));
          await this.loadData();
          this.toast.success('Successfully deleted historical data.');
          this.isLoading = false;
        } catch (e) {
          this.toast.success('Failed to delete historical data.');
        } finally {
          this.isLoading = false;
        }
      });
  }
}
