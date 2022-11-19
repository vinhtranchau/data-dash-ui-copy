import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TradeAbleInstrumentsPanelComponent } from './trade-able-instruments-panel.component';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { PipeModule } from '../../../../ui-kit/pipe/pipe.module';

@NgModule({
  declarations: [TradeAbleInstrumentsPanelComponent],
  imports: [CommonModule, MatCardModule, SpinnerModule, MatIconModule, MatTooltipModule, PipeModule],
  exports: [TradeAbleInstrumentsPanelComponent],
})
export class TradeAbleInstrumentsPanelModule {}
