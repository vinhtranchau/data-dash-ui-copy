import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DateFnsModule } from 'ngx-date-fns';

import { PipeModule } from '../pipe/pipe.module';
import { DataTableComponent } from './data-table/data-table.component';
import { DataTablePageComponent } from './data-table-page/data-table-page.component';
import { DataTableHeaderComponent } from './data-table-header/data-table-header.component';

import { ConditionalFormatPipe } from './data-table-pipes/conditional-format.pipe';

@NgModule({
  declarations: [DataTableComponent, DataTablePageComponent, DataTableHeaderComponent, ConditionalFormatPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    DateFnsModule,
    PipeModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatCheckboxModule,
  ],
  exports: [DataTableComponent, DataTablePageComponent, DataTableHeaderComponent],
})
export class TableModule {}
