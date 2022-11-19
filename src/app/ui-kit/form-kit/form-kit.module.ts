import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateModule } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';

import { MtxSliderModule } from '@ng-matero/extensions/slider';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { DatetimeAdapter, MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { MomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';

const STABLE_DATE_FORMATS = {
  parse: {
    dateInput: ' YYYY-MM-DD',
    monthInput: 'MMMM',
    timeInput: 'HH:mm',
    datetimeInput: 'YYYY-MM-DD HH:mm',
  },
  display: {
    dateInput: ' YYYY-MM-DD',
    monthInput: 'MMMM',
    timeInput: 'HH:mm',
    datetimeInput: 'YYYY-MM-DD HH:mm',
    monthYearLabel: 'YYYY-MM-DD',
    dateA11yLabel: ' YYYY-MM-DD',
    monthYearA11yLabel: ' YYYY-MM-DD',
    popupHeaderDateLabel: 'MMM DD, ddd',
  },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatStepperModule,
    MatBadgeModule,
    MatCardModule,
    MatDatepickerModule,
    NativeDateModule,
    MatMomentDateModule,
    MatSliderModule,
    MatExpansionModule,
    MatRadioModule,
    MtxSliderModule,
    MtxSelectModule,
    MtxDatetimepickerModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatStepperModule,
    MatBadgeModule,
    MatCardModule,
    MatMomentDateModule,
    MatDatepickerModule,
    NativeDateModule,
    MatSliderModule,
    MatExpansionModule,
    MatRadioModule,
    MtxSelectModule,
    MtxSliderModule,
    MtxDatetimepickerModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter,
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    { provide: MAT_DATE_FORMATS, useValue: STABLE_DATE_FORMATS },
    { provide: MTX_DATETIME_FORMATS, useValue: STABLE_DATE_FORMATS },
  ],
})
export class FormKitModule {}
