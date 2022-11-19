import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PaginatorButtonsComponent } from './paginator-buttons.component';

@NgModule({
  declarations: [PaginatorButtonsComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [PaginatorButtonsComponent],
})
export class PaginatorButtonsModule {}
