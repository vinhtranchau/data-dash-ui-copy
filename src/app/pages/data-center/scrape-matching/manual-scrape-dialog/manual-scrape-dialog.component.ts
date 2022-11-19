import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { XlsUploadResult } from '../../../../core/models/common.model';
import { ExcelHistoricalData, HistoricalData } from '../../../../core/models/historical-data.model';
import { ManualScrapeIdUpload } from '../../../../core/models/scrapes.model';
import { DiService } from '../../../../core/services/di.service';
import { StoreService } from '../../../../core/services/store.service';
import { addTimezone } from '../../../../core/utils/dates.util';
import { TableColumn } from '../../../../ui-kit/table/table.model';
import { ToastPriority } from '../../../../ui-kit/toast/toast.model';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-manual-scrape-dialog',
  templateUrl: './manual-scrape-dialog.component.html',
  styleUrls: ['./manual-scrape-dialog.component.scss'],
})
export class ManualScrapeDialogComponent implements OnInit, OnDestroy {
  homeUrl = environment.baseUrl;
  form: UntypedFormGroup = this.fb.group({
    index_details_id: [null, Validators.required],
    scrape_id: [null, Validators.required],
    scrape_id_components: this.fb.array([this.fb.group({ scrape_id_component: [''] })]),
    price: null,
    report_start_date: null,
    report_end_date: null,
    published_date: null,
    stable_assigned_date: [{ value: null, disabled: true }],
  });

  columns: TableColumn[] = [
    { name: 'published_date', content: 'published_date', title: 'Published Date', pipe: 'date' },
    { name: 'stable_assigned_date', content: 'stable_assigned_date', title: 'Stable Assigned Date', pipe: 'date' },
    { name: 'report_start_date', content: 'report_start_date', title: 'Report Start Date', pipe: 'date' },
    { name: 'report_end_date', content: 'report_end_date', title: 'Report End Date', pipe: 'date' },
    { name: 'price', content: 'price', title: 'Price' },
  ];
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<HistoricalData>([]);
  isLoading = false;
  isChecked = false;
  showScrapeIdComponents: boolean = false;
  // Dropdown options
  indexUUIDs$ = this.store.indexUUIDs$;
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private store: StoreService,
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ManualScrapeDialogComponent>,
    private toast: ToastService,
    private diService: DiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form
      .get('report_end_date')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        this.form.get('stable_assigned_date')?.setValue(value);
        this.isChecked = false;
      });
    this.form
      .get('index_details_id')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((id) => {
        this.loadMatchedScrapeId(id);
        this.isChecked = false;
      });
    this.form
      .get('published_date')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        this.isChecked = false;
      });
    this.form
      .get('report_start_date')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        this.isChecked = false;
      });

    // Set scrape_id_components when changing scrape_id
    this.form
      .get('scrape_id')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((scrapeId) => {
        if (scrapeId) {
          this.scrapeIdComponents.clear({ emitEvent: false });
          scrapeId.split('\t').map((value: string) => {
            this.scrapeIdComponents?.push(this.fb.group({ scrape_id_component: [value] }), { emitEvent: false });
          });
        } else {
          this.scrapeIdComponents.clear({ emitEvent: false });
          this.scrapeIdComponents?.push(this.fb.group({ scrape_id_component: [''] }), { emitEvent: false });
        }
      });

    // Set scrape_id when changing scrape_id_components
    this.form
      .get('scrape_id_components')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((scrapeIdComponents: { scrape_id_component: string }[]) => {
        this.form
          .get('scrape_id')
          ?.setValue(scrapeIdComponents.map((oneComponent) => oneComponent.scrape_id_component).join('\t'), {
            emitEvent: false,
          });
      });
  }

  get scrapeIdComponents(): UntypedFormArray {
    return this.form.get('scrape_id_components') as UntypedFormArray;
  }

  addScrapeIdComponent(): void {
    this.scrapeIdComponents?.push(this.fb.group({ scrape_id_component: [''] }));
    // HOTFIX: Enforce detect changes when adding new field.Form.invalid was originally true, but after the adding
    //  it goes back to false. This change should be detected manually.
    this.cdr.detectChanges();
  }

  removeScrapeIdComponent(index: number): void {
    if (index > 0) {
      this.scrapeIdComponents?.removeAt(index);
    }
  }

  async loadMatchedScrapeId(id: string) {
    try {
      const scrapeId = await firstValueFrom(this.diService.getDIMatchedScrapeId(id));
      this.form.get('scrape_id')?.setValue(scrapeId);
    } catch (e) {
      this.toast.error('unable to fetch scrape id of index.');
    } finally {
    }
  }

  async save() {
    try {
      const body: any[] = [];
      if (
        this.form.value.published_date &&
        this.form.value.report_start_date &&
        this.form.value.report_end_date &&
        this.form.value.price
      ) {
        body.push({
          published_date: addTimezone(this.form.value.published_date),
          report_start_date: addTimezone(this.form.value.report_start_date),
          report_end_date: addTimezone(this.form.value.report_end_date),
          price: this.form.value.price,
        });
      }
      body.push(...this.dataSource.data);
      if (body.length === 0) {
        this.toast.error('At least one price entry must be submitted.');
      } else {
        const payload: ManualScrapeIdUpload = {
          index_details_id: this.form.value.index_details_id,
          scrape_id: this.form.value.scrape_id,
          body: body,
          force: this.isChecked,
        };
        this.isLoading = true;
        const postResult = await firstValueFrom(this.diService.postManualScrape(payload));
        if (!postResult) {
          this.toast.success('Successfully saved manual scrape id.');
          this.dialogRef.close(true);
        } else {
          if (postResult.includes('future_date')) {
            this.toast.warning(
              'At least one date input is in the future, save the form again if this is intended.',
              ToastPriority.Medium
            );
          }
          if (postResult.includes('wrong_date_frequency')) {
            this.toast.warning(
              'Wrong date frequency for the index detected, save the form again if this is intended.',
              ToastPriority.Medium
            );
          }
          this.isChecked = true; // force post on the next try if no input changes
        }
      }
    } catch (e) {
      this.toast.error('There was an error saving, please contact the admins!');
    } finally {
      this.isLoading = false;
    }
  }

  onFileUpload(data: XlsUploadResult<ExcelHistoricalData>) {
    // NOTE: It is supposed to have only 1 sheet
    const sheetName = Object.keys(data)[0];
    if (!sheetName) {
      this.toast.error('Invalid format of file.');
    }
    this.dataSource.data = data[sheetName]
      .filter((item) => item.published_date && item.report_start_date && item.report_end_date && item.price)
      .map((x) => ({
        ...x,
        stable_assigned_date: new Date(Math.round((x.report_end_date - 25569) * 86400 * 1000)),
        published_date: new Date(Math.round((x.published_date - 25569) * 86400 * 1000)),
        report_start_date: new Date(Math.round((x.report_start_date - 25569) * 86400 * 1000)),
        report_end_date: new Date(Math.round((x.report_end_date - 25569) * 86400 * 1000)),
        scraped_at_date: new Date(Math.round((x.report_end_date - 25569) * 86400 * 1000)), // backend will replace scraped_at_date with current time
      }));
    this.isChecked = false;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
