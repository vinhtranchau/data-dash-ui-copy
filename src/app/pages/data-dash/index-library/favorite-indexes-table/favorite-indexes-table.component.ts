import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { FavoriteIndexes } from '../../../../core/models/index.model';
import { standaloneModalRoute } from '../../../../core/routes/standalone-modal.route';
import { CommonService } from '../../../../core/services/common.service';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { LoadDataEvent, TableAction, TableActionType } from '../../../../ui-kit/table/table.model';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { favoriteIndexesStickyColumns, favoriteIndexesTableColumns } from './favorite-indexes-table.config';

@Component({
  selector: 'dd-favorite-indexes-table',
  templateUrl: './favorite-indexes-table.component.html',
  styleUrls: ['./favorite-indexes-table.component.scss'],
})
export class FavoriteIndexesTableComponent implements OnInit {
  dataSource = new MatTableDataSource<FavoriteIndexes>([]);
  columns = favoriteIndexesTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  stickyColumns = favoriteIndexesStickyColumns;
  lastLoadDataEvent: LoadDataEvent;

  total = 0;
  isDownloading = false;
  tableDataLoading = true;

  constructor(
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {}

  async loadData(e: LoadDataEvent) {
    this.lastLoadDataEvent = e;
    const { pageSize, pageIndex, keyword } = e;
    try {
      this.tableDataLoading = true;
      const { results, count } = await firstValueFrom(
        this.indexLibraryService.getFavoriteIndexes(pageSize, pageIndex + 1, keyword || '')
      );
      this.dataSource.data = results;
      this.total = count;
    } catch (e) {
      this.toast.error('Failed to load favorite indexes.');
    } finally {
      this.tableDataLoading = false;
    }
  }

  action(obj: TableAction) {
    switch (obj.action) {
      case TableActionType.RouterLink:
        this.openIndexModal(obj.id);
        break;
      case TableActionType.Star:
        this.removeFavourite(obj.id);
        break;
      default:
        break;
    }
  }

  async removeFavourite(id: string) {
    if (!id) return;
    try {
      await firstValueFrom(this.indexLibraryService.postFavorite(id));
      this.dataSource.data = this.dataSource.data.filter((index) => {
        if (index.id === id) {
          return false;
        }
        return true;
      });
      this.toast.success('Removed index from favorites.');
    } catch (error) {
      this.toast.error('Failed to remove index from favorites.');
    }
  }

  openIndexModal(id: string) {
    const indexIdUrl = `${standaloneModalRoute.root}/${standaloneModalRoute.indexDetails}/${id}/${0}`;
    this.commonService.openStandaloneModal(indexIdUrl);
  }
}
