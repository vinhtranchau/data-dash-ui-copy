import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UploaderExcelComponent } from './uploader-excel/uploader-excel.component';
import { UploaderComponent } from './uploader-standard/uploader.component';

@NgModule({
  declarations: [UploaderComponent, UploaderExcelComponent],
  imports: [MatIconModule, MatButtonModule],
  exports: [UploaderComponent, UploaderExcelComponent],
})
export class UploaderModule {}
