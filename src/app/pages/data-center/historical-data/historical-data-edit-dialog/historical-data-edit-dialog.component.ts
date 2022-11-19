import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, map } from 'rxjs';

import { TableColumn } from '../../../../ui-kit/table/table.model';
import { XlsUploadResult } from '../../../../core/models/common.model';
import { StoreService } from '../../../../core/services/store.service';
import { ExcelHistoricalData, HistoricalData } from '../../../../core/models/historical-data.model';
import { HistoricalDataService } from '../../../../core/services/historical-data.service';
import { DiService } from '../../../../core/services/di.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'dd-historical-data-edit-dialog',
  templateUrl: './historical-data-edit-dialog.component.html',
  styleUrls: ['./historical-data-edit-dialog.component.scss'],
})
export class HistoricalDataEditDialogComponent implements OnInit {
  homeUrl = environment.baseUrl;
  columns: TableColumn[] = [
    { name: 'stable_assigned_date', content: 'stable_assigned_date', title: 'Stable Assigned Date', pipe: 'date' },
    { name: 'published_date', content: 'published_date', title: 'Published Date', pipe: 'date' },
    { name: 'report_start_date', content: 'report_start_date', title: 'Report Start Date', pipe: 'date' },
    { name: 'report_end_date', content: 'report_end_date', title: 'Report End Date', pipe: 'date' },
    { name: 'scraped_at_date', content: 'scraped_at_date', title: 'Scraped At Date', pipe: 'date' },
    { name: 'price', content: 'price', title: 'Price' },
  ];
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<HistoricalData>([]);
  indexUUIDs$ = this.store.indexUUIDs$;
  diSpiders$ = this.store.diSpiders$.pipe(map((res) => res.map((spider) => ({ spider }))));
  diScrapeIds: { [key: string]: { scrape_id: string }[] } = {}; // Key is the spider
  isLoading: boolean = false;

  form: UntypedFormGroup = this.fb.group({
    index_details_id: [null, [Validators.required]],
    spider: [null],
    scrape_id: [null],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: null,
    private dialogRef: MatDialogRef<HistoricalDataEditDialogComponent>,
    private toast: ToastService,
    private historicalDataService: HistoricalDataService,
    private store: StoreService,
    private diService: DiService
  ) {}

  ngOnInit(): void {
    this.form.get('spider')?.valueChanges.subscribe({
      next: async (spider) => {
        this.form.get('scrape_id')?.setValue(null);
        let scrapeIds = this.diScrapeIds[spider];
        if (scrapeIds && scrapeIds.length) {
          // Check if scrape id is already fetched or not
          return;
        }
        this.diScrapeIds[spider] = await firstValueFrom(
          this.diService.getDIScrapeIds(spider).pipe(map((res) => res.map((scrape_id) => ({ scrape_id }))))
        );
      },
    });
  }

  onFileUpload(data: XlsUploadResult<ExcelHistoricalData>): void {
    // NOTE: It is supposed to have only 1 sheet
    const sheetName = Object.keys(data)[0];
    if (!sheetName) {
      this.toast.error('Invalid format of file.');
    }
    this.dataSource.data = data[sheetName]
      .filter(
        (item) =>
          item.stable_assigned_date &&
          item.published_date &&
          item.report_start_date &&
          item.report_end_date &&
          item.scraped_at_date &&
          item.price
      )
      .map((x) => ({
        ...x,
        stable_assigned_date: new Date(Math.round((x.stable_assigned_date - 25569) * 86400 * 1000)),
        published_date: new Date(Math.round((x.published_date - 25569) * 86400 * 1000)),
        report_start_date: new Date(Math.round((x.report_start_date - 25569) * 86400 * 1000)),
        report_end_date: new Date(Math.round((x.report_end_date - 25569) * 86400 * 1000)),
        scraped_at_date: new Date(Math.round((x.scraped_at_date - 25569) * 86400 * 1000)),
      }));
  }

  async save() {
    try {
      const payload = {
        index_details_id: this.form.get('index_details_id')?.value,
        spider: this.form.get('spider')?.value,
        scrape_id: this.form.get('scrape_id')?.value,
        historical_data: this.dataSource.data,
      };
      this.isLoading = true;
      await firstValueFrom(this.historicalDataService.updateHistoricalData(payload));
      this.toast.success('Successfully saved historical data, the results may take a while to appear.');
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('There was an error saving, please contact the admins!');
    } finally {
      this.isLoading = false;
    }
  }
}
