import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, map } from 'rxjs';

import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { ScrapeMatchingService } from '../../../../core/services/scrape-matching.service';
import { StoreService } from '../../../../core/services/store.service';
import { DiService } from '../../../../core/services/di.service';
import { TableColumn } from '../../../../ui-kit/table/table.model';
import { ScrapeMatchingUploadFormat } from '../../../../core/models/scrapes.model';
import { XlsUploadResult } from '../../../../core/models/common.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'dd-scrape-matching-dialog',
  templateUrl: './scrape-matching-dialog.component.html',
  styleUrls: ['./scrape-matching-dialog.component.scss'],
})
export class ScrapeMatchingDialogComponent implements OnInit {
  homeUrl = environment.baseUrl;
  form: UntypedFormGroup = this.fb.group({
    sic: null,
    spider: null,
    scrape_id: null,
  });

  columns: TableColumn[] = [
    { name: 'SIC', content: 'SIC', title: 'SIC' },
    { name: 'Scrape ID', content: 'Scrape ID', title: 'Scrape ID', pipe: 'truncate' },
  ];
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<ScrapeMatchingUploadFormat>([]);

  isLoading = false;

  // Dropdown options
  indexUUIDs$ = this.store.indexUUIDs$;
  diSpiders$ = this.store.diSpiders$.pipe(map((res) => res.map((spider) => ({ spider }))));
  diScrapeIds: { [key: string]: { scrape_id: string }[] } = {}; // Key is the spider

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ScrapeMatchingDialogComponent>,
    private toast: ToastService,
    private scrapeMatchingService: ScrapeMatchingService,
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

  onFileUpload(data: XlsUploadResult<ScrapeMatchingUploadFormat>): void {
    // NOTE: It is supposed to have only 1 sheet
    const sheetName = Object.keys(data)[0];
    if (!sheetName) {
      this.toast.error('Invalid format of file.');
    }
    this.dataSource.data = data[sheetName].filter((item) => item.SIC && item['Scrape ID']);
  }

  async save() {
    try {
      const body: Record<any, any> = {};
      if (this.form.value.sic && this.form.value.scrape_id) {
        body[this.form.value.sic] = this.form.value.scrape_id;
      }
      for (let el of this.dataSource.data) {
        if (el.SIC && el['Scrape ID']) {
          body[el.SIC] = el['Scrape ID'];
        }
      }

      this.form.disable();
      this.isLoading = true;
      await firstValueFrom(this.scrapeMatchingService.uploadScrapeMatching({ sic_matching_dict: body }));
      this.toast.success('Successfully saved scrape matchings, the results may take a while to appear.');
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('There was an error saving, please contact the admins!');
    } finally {
      this.form.enable();
      this.isLoading = false;
    }
  }
}
