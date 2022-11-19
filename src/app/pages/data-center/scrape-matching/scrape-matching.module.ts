import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { TableModule } from '../../../ui-kit/table/table.module';
import { UploaderModule } from '../../../ui-kit/uploader/uploader.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { ScrapeMatchingRoutingModule } from './scrape-matching-routing.module';

import { ScrapeMatchingComponent } from './scrape-matching.component';
import { ScrapeMatchingDialogComponent } from './scrape-matching-dialog/scrape-matching-dialog.component';
import { ManualScrapeDialogComponent } from './manual-scrape-dialog/manual-scrape-dialog.component';

@NgModule({
  declarations: [ScrapeMatchingComponent, ScrapeMatchingDialogComponent, ManualScrapeDialogComponent],
  imports: [
    CommonModule,
    TableModule,
    UploaderModule,
    DialogModule.forRoot(),
    FormKitModule,
    ScrapeMatchingRoutingModule,
    ClipboardModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'YYYY-MM-DD',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'YYYY-MM-DD',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class ScrapeMatchingModule {
}
