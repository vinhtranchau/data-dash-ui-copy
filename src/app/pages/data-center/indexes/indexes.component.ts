import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom, map, tap } from 'rxjs';

import { PermissionType } from '../../../core/models/permission.model';
import { Index, IndexState, Tier, UnderwriterApproval } from '../../../core/models/index.model';
import { LoadDataEvent, TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { standaloneModalRoute } from '../../../core/routes/standalone-modal.route';
import { indexTableColumns, indexTableStickyColumns } from './indexes-table.config';
import { relativePath } from '../../../core/utils/route.util';
import { IndexService } from '../../../core/services/index.service';
import { CommonService } from '../../../core/services/common.service';
import { AdvancedIndexFilterDialogService } from '../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { TextTransformPipe } from '../../../ui-kit/pipe/text-transform.pipe';
import { IndexEditDialogComponent } from './index-edit-dialog/index-edit-dialog.component';

@Component({
  selector: 'dd-indexes',
  templateUrl: './indexes.component.html',
  styleUrls: ['./indexes.component.scss'],
})
export class IndexesComponent implements OnInit {
  PermissionType = PermissionType;
  dataSource = new MatTableDataSource<Index>([]);
  columns = indexTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  stickyColumns = indexTableStickyColumns;
  lastLoadDataEvent: LoadDataEvent;

  total = 0;
  isDownloading = false;
  indexDetailsLoading = false;
  tableDataLoading = true;

  constructor(
    private indexService: IndexService,
    private textTransformPipe: TextTransformPipe,
    private dialog: MatDialog,
    private commonService: CommonService,
    public advancedIndexFilterService: AdvancedIndexFilterDialogService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.advancedIndexFilterService.resetFilterDialog();
  }

  async loadData(e: LoadDataEvent) {
    this.lastLoadDataEvent = e;
    const { pageSize, pageIndex, keyword } = e;
    try {
      this.tableDataLoading = true;
      const {
        data: { results, total },
      } = await firstValueFrom(
        this.indexService.indexSearch(
          pageSize,
          pageIndex + 1,
          keyword || '',
          this.advancedIndexFilterService.indexFilter
        )
      );
      // Table bugs out without this
      this.dataSource.data = results.map((x) => ({
        ...x,
        tier: this.textTransformPipe.transform(x.tier) as Tier,
        underwriter_approval: this.textTransformPipe.transform(x.underwriter_approval) as UnderwriterApproval,
        index_state: this.textTransformPipe.transform(x.index_state) as IndexState,
      }));
      this.total = total;
    } catch (e) {
      this.toast.error('Failed to load index details.');
    } finally {
      this.tableDataLoading = false;
    }
  }

  async downloadAllIndexes() {
    try {
      this.isDownloading = true;
      await firstValueFrom(this.indexService.downloadIndexes());
    } catch (e) {
      this.toast.error('Failed to download index data.');
    } finally {
      this.isDownloading = false;
    }
  }

  openIndexDetailDialog(data?: Index) {
    return this.dialog
      .open(IndexEditDialogComponent, {
        width: '950px',
        data,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData(this.lastLoadDataEvent));
  }

  openFilterDialog() {
    this.advancedIndexFilterService.openIndexFilterDialog().subscribe(() => this.loadData(this.lastLoadDataEvent));
  }

  action(obj: TableAction) {
    switch (obj.action) {
      case TableActionType.Edit:
        this.editIndexDetail(obj.id).then();
        break;
      case TableActionType.Download:
        this.downloadIndexDetail(obj.id).then();
        break;
      case TableActionType.RouterLink:
        // String(0) means the very first tab - GeneralInformation of the Index Details Dialog
        this.commonService.openStandaloneModal(
          relativePath([standaloneModalRoute.root, standaloneModalRoute.indexDetails, obj.id, String(0)])
        );
        break;
      case TableActionType.Sync:
        this.syncIndexPrices(obj.id).then();
        break;
      default:
        break;
    }
  }

  private async editIndexDetail(indexId: string) {
    try {
      this.indexDetailsLoading = true;
      await firstValueFrom(this.indexService.getIndex(indexId).pipe(tap((data) => this.openIndexDetailDialog(data))));
    } catch (e) {
      this.toast.error('Failed to load index details.');
    } finally {
      this.indexDetailsLoading = false;
    }
  }

  private async downloadIndexDetail(indexId: string) {
    try {
      const found = this.dataSource.data.find((item) => item.id === indexId);
      if (!found) {
        return;
      }
      await firstValueFrom(this.indexService.downloadIndexData(indexId, `Index_Data__${found.stable_index_code}`));
    } catch (e) {
      this.toast.error('Failed to download index details.');
    } finally {
    }
  }

  private async syncIndexPrices(indexId: string) {
    try {
      await firstValueFrom(this.indexService.syncIndexPrice(indexId));
      this.toast.success('Successfully sent request to sync index prices.');
    } catch (e) {
      this.toast.error('Failed to sync index prices.');
    } finally {
    }
  }
}
