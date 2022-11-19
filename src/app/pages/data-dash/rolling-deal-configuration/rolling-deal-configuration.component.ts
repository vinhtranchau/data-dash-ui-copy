import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom, map } from 'rxjs';

import { RollingDealConfigurationService } from '../../../core/services/rolling-deal-configuration.service';
import { PermissionType } from '../../../core/models/permission.model';
import { rollingDealConfigurationTableColumns } from './rolling-deal-configuration-table.config';
import { RollingDealConfigurationData } from '../../../core/models/rolling-deal-configuration.model';
import { LoadDataEvent, TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { RollingDealConfigurationEditDialogComponent } from './rolling-deal-configuration-edit-dialog/rolling-deal-configuration-edit-dialog.component';

@Component({
  selector: 'dd-rolling-deal-configuration',
  templateUrl: './rolling-deal-configuration.component.html',
  styleUrls: ['./rolling-deal-configuration.component.scss'],
})
export class RollingDealConfigurationComponent implements OnInit {
  PermissionType = PermissionType;
  columns = rollingDealConfigurationTableColumns;
  displayColumns = this.columns.map((x) => x.name);
  dataSource: MatTableDataSource<RollingDealConfigurationData> = new MatTableDataSource();

  isLoading = true;
  total = 0;
  lastLoadEvent: LoadDataEvent;

  constructor(
    private readonly rollingDealConfigurationService: RollingDealConfigurationService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  async loadData(e: LoadDataEvent) {
    const { pageSize, pageIndex, keyword } = e;
    this.lastLoadEvent = e;
    try {
      this.isLoading = true;
      const { results, count } = await firstValueFrom(
        this.rollingDealConfigurationService.getRollingDealIndexes(pageSize, pageIndex + 1, keyword || '').pipe(
          map((res) => {
            res.results = res.results.map((x) => ({
              ...x,
              sic: x.index.stable_index_code,
            }));
            return res;
          })
        )
      );
      this.dataSource.data = results;
      this.total = count;
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      const found = this.dataSource.data.find((x) => x.index.stable_index_code === obj.id);
      if (found) {
        this.openRollingDealConfigurationDialog(found);
      }
    }
  }

  private openRollingDealConfigurationDialog(config?: RollingDealConfigurationData) {
    this.dialog
      .open(RollingDealConfigurationEditDialogComponent, {
        width: '450px',
        data: { config },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData(this.lastLoadEvent));
  }
}
