import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe, TitleCasePipe } from '@angular/common';

import { TextTransformPipe } from './text-transform.pipe';
import { BooleanPipe } from './boolean.pipe';
import { TruncatePipe } from './truncate.pipe';
import { PermissionsPipe } from './permissions.pipe';
import { PercentageChangePipe } from './percentage-change.pipe';
import { DisplayObjectPipe } from './display-object.pipe';
import { EnumToLabelPipe } from './enum-to-label.pipe';
import { AbsolutePathPipe } from './absolute-path.pipe';
import { NullPipe } from './null.pipe';
import { GetDecimalPipe } from './get-decimal.pipe';
import { TimeZonePipe } from './timezone.pipe';
import { SecondsToMinutesPipe } from './seconds-to-minutes.pipe';
import { CurrencyAndUnitPipe } from './currency-and-unit.pipe';
import { NotificationTypePipe } from './notification-type.pipe';

@NgModule({
  declarations: [
    TextTransformPipe,
    BooleanPipe,
    TruncatePipe,
    PermissionsPipe,
    PercentageChangePipe,
    DisplayObjectPipe,
    EnumToLabelPipe,
    AbsolutePathPipe,
    NullPipe,
    GetDecimalPipe,
    TimeZonePipe,
    SecondsToMinutesPipe,
    CurrencyAndUnitPipe,
    NotificationTypePipe,
  ],
  imports: [CommonModule],
  exports: [
    TextTransformPipe,
    BooleanPipe,
    TruncatePipe,
    PermissionsPipe,
    PercentageChangePipe,
    DisplayObjectPipe,
    EnumToLabelPipe,
    AbsolutePathPipe,
    NullPipe,
    GetDecimalPipe,
    TimeZonePipe,
    SecondsToMinutesPipe,
    CurrencyAndUnitPipe,
    NotificationTypePipe,
  ],
  providers: [TitleCasePipe, DecimalPipe, PercentPipe],
})
export class PipeModule {}
