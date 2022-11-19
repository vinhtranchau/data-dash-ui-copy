import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RollingDealActionComponent } from './rolling-deal-action.component';
import { RollingDealDialogComponent } from './rolling-deal-dialog/rolling-deal-dialog.component';

@NgModule({
  declarations: [RollingDealActionComponent, RollingDealDialogComponent],
  imports: [CommonModule],
})
export class RollingDealActionModule {}
