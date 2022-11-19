import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { IndexDetailsStoreService } from '../../index-details-store.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { AdvancedIndexFilterDialogService } from '../../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.service';

import { IndexFlattened, IndexSort } from '../../../../core/models/index.model';
import { LoadDataEvent, TableAction, TableActionType } from '../../../../ui-kit/table/table.model';
import { correlationTableColumns } from './index-correlation-tab.config';
import { PermissionType } from '../../../../core/models/permission.model';
import { standaloneModalRoute } from '../../../../core/routes/standalone-modal.route';
import { IndexCorrelationService } from '../../../../core/services/index-correlation.service';
import { IndexCorrelationSummary } from '../../../../core/models/index-correlation.model';
import { CommonService } from '../../../../core/services/common.service';
import { MatDialogRef } from '@angular/material/dialog';
import { IndexDetailsDialogComponent } from '../../index-details-dialog/index-details-dialog.component';

@Component({
  selector: 'dd-index-correlation-tab',
  templateUrl: './index-correlation-tab.component.html',
  styleUrls: ['./index-correlation-tab.component.scss'],
})
export class IndexCorrelationTabComponent implements OnInit {
  @Input() fullscreen = false;

  PermissionType = PermissionType;
  dataSource = new MatTableDataSource<IndexCorrelationSummary>([]);
  columns = correlationTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  stickyColumns = ['stable_index_code', 'compare'];
  indexDetails: IndexFlattened;
  total = 0;
  tableDataLoading = true;
  lastLoadDataEvent: LoadDataEvent;
  currentSortField: IndexSort = { field: '', order_by: '' };

  constructor(
    public indexDetailsStoreService: IndexDetailsStoreService,
    private toast: ToastService,
    public advancedIndexFilterService: AdvancedIndexFilterDialogService,
    private indexCorrelationService: IndexCorrelationService,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<IndexDetailsDialogComponent>
  ) {}

  ngOnInit(): void {
    this.advancedIndexFilterService.resetFilterDialog();
  }

  async loadData(e: LoadDataEvent) {
    try {
      this.tableDataLoading = true;
      const { pageSize, pageIndex, keyword } = e;
      this.lastLoadDataEvent = e;

      const {
        data: { results, total },
      } = await firstValueFrom(
        this.indexCorrelationService.getIndexesCorrelation(
          this.indexDetailsStoreService.indexId,
          pageSize,
          pageIndex,
          keyword || '',
          this.advancedIndexFilterService.indexFilter,
          this.currentSortField
        )
      );
      this.total = total;
      this.dataSource.data = results;
    } catch (e) {
      this.dataSource.data = [];
      this.total = 0;
      this.toast.error('Failed to load index correlations.');
    } finally {
      this.tableDataLoading = false;
    }
  }

  action(obj: TableAction) {
    const id = obj.id;
    switch (obj.action) {
      case TableActionType.Compare:
        const correlationUrl = `${standaloneModalRoute.root}/${standaloneModalRoute.indexCorrelations}/${this.indexDetailsStoreService.indexId}/${id}`;
        if (window.innerWidth < 768) {
          // For mobile
          this.dialogRef.close();
          setTimeout(() => {
            this.commonService.openStandaloneModal(correlationUrl, false); // Always open modal only
          }, 400);
        } else {
          this.commonService.openStandaloneModal(correlationUrl, !this.fullscreen); // Open opposite type
        }
        break;
      case TableActionType.RouterLink:
        const indexIdUrl = `${standaloneModalRoute.root}/${standaloneModalRoute.indexDetails}/${id}/0`;
        if (window.innerWidth < 768) {
          // For mobile
          this.dialogRef.close();
          setTimeout(() => {
            this.commonService.openStandaloneModal(indexIdUrl, false); // Always open modal only
          }, 400);
        } else {
          this.commonService.openStandaloneModal(indexIdUrl, !this.fullscreen); // Open opposite type
        }
        break;
      default:
        break;
    }
  }

  sort(e: Sort) {
    this.currentSortField.field = e.active;
    this.currentSortField.order_by = e.direction;
    this.loadData(this.lastLoadDataEvent);
  }

  openFilterDialog() {
    this.advancedIndexFilterService.indexFilter.filters = this.advancedIndexFilterService.indexFilter.filters.map(
      (data) => {
        // FE uses id but BE uses index_details_id
        if (data.field === 'index_details_id') data.field = 'id';
        return data;
      }
    );
    this.advancedIndexFilterService.openIndexCorrelationFilterDialog().subscribe(() => {
      this.loadData(this.lastLoadDataEvent);
    });
  }
}
