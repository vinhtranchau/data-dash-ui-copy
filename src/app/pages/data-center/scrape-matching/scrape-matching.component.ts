import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';

import { ScrapeMatching } from '../../../core/models/scrapes.model';
import { ScrapeMatchingService } from '../../../core/services/scrape-matching.service';
import { PermissionLevel, PermissionType } from '../../../core/models/permission.model';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { StoreService } from '../../../core/services/store.service';
import { LoadDataEvent, TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { DialogService } from '../../../ui-kit/dialog/dialog.service';
import { scrapeMatchingTableColumns } from './scrape-matching-table.config';
import { ScrapeMatchingDialogComponent } from './scrape-matching-dialog/scrape-matching-dialog.component';
import { CommonService } from '../../../core/services/common.service';
import { relativePath } from '../../../core/utils/route.util';
import { standaloneModalRoute } from '../../../core/routes/standalone-modal.route';
import { ManualScrapeDialogComponent } from './manual-scrape-dialog/manual-scrape-dialog.component';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'dd-scrape-matching',
  templateUrl: './scrape-matching.component.html',
  styleUrls: ['./scrape-matching.component.scss'],
})
export class ScrapeMatchingComponent implements OnInit {
  PermissionType = PermissionType;
  dataSource = new MatTableDataSource<ScrapeMatching>([]);
  columns = scrapeMatchingTableColumns;
  displayedColumns = this.columns.map((x) => x.name);
  lastLoadEvent: LoadDataEvent;
  hasEditPermission: boolean = false;

  total = 0;
  isLoading = true;

  constructor(
    private scrapeMatchingService: ScrapeMatchingService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private store: StoreService,
    private toast: ToastService,
    private clipboard: Clipboard,
    private commonService: CommonService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.store.loadIndexUUIDs();
    this.store.loadDISpiders();
    this.hasEditPermission =
      this.roleService.getPermissionLevel(this.PermissionType.ScrapeMatchingTable) >= PermissionLevel.Edit;
  }

  async loadData(e: LoadDataEvent) {
    const { pageSize, pageIndex, keyword } = e;
    this.lastLoadEvent = e;
    try {
      this.isLoading = true;
      const { results, count } = await firstValueFrom(
        this.scrapeMatchingService.getScrapeMatchings(pageSize, pageIndex + 1, keyword || '')
      );
      this.dataSource.data = results;
      this.total = count;
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  add(): void {
    const dialogRef = this.dialog.open(ScrapeMatchingDialogComponent, {
      width: '850px',
      panelClass: 'rootModal',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadData(this.lastLoadEvent).then();
      }
    });
  }

  action(obj: TableAction): void {
    if (obj.action === TableActionType.Delete) {
      const data = this.dataSource.data.find((x) => x.id === obj.id);

      if (!data) {
        return;
      }

      this.dialogService
        .confirm(
          'Delete Scrape Matching',
          `
            <div class="bg-honey text-14 text-white px-15 py-10 rounded shadow mb-20"> <b>WARNING</b>: This will delete the following and all other scrapes matched to this SIC with a higher chain index. </div>
            <table class="table-auto border w-full mb-10">
              <tbody>
                <tr class="border-b">
                  <td class="px-15 py-5 border-r">SIC</td>
                  <td class="px-15 py-5">${data.index_details_id.stable_index_code}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-15 py-5 border-r">Scrape ID</td>
                  <td class="px-15 py-5 whitespace-pre-wrap">${data.scrape_details_id.description}</td>
                </tr>
                <tr>
                  <td class="px-15 py-5 border-r">Chain Index</td>
                  <td class="px-15 py-5">${data.chain_index}</td>
                </tr>
              </tbody>
            </table>
          `
        )
        .then(async (confirm) => {
          if (!confirm) {
            return;
          }
          try {
            this.isLoading = true;
            await firstValueFrom(
              this.scrapeMatchingService.deleteScrapeMatching(
                data.index_details_id.id,
                data.scrape_details_id.id,
                data.chain_index
              )
            );
            await this.loadData(this.lastLoadEvent);
            this.toast.success('Successfully deleted scrape matching.');
            this.isLoading = false;
          } catch (e) {
            this.toast.error('Failed to delete scrape matching.');
          } finally {
            this.isLoading = false;
          }
        });
    } else if (obj.action === TableActionType.ContentPaste) {
      this.clipboard.copy(obj.id);
      this.toast.success('Scrape ID copied to clipboard');
    } else if (obj.action == TableActionType.RouterLink) {
      this.commonService.openStandaloneModal(
        relativePath([standaloneModalRoute.root, standaloneModalRoute.indexDetails, obj.id, String(0)])
      );
    }
  }

  uploadManualScrapes() {
    this.dialog.open(ManualScrapeDialogComponent, {
      width: '1100px',
      panelClass: 'rootModal',
    });
  }
}
