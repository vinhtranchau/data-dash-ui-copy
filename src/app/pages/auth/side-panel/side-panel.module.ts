import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidePanelComponent } from './side-panel.component';

@NgModule({
  declarations: [
    SidePanelComponent,
  ],
  imports: [CommonModule],
  exports: [SidePanelComponent]
})
export class SidePanelModule {
}
