import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { XlsUploadResult } from '../../../core/models/common.model';

@Component({
  selector: 'dd-excel-uploader',
  templateUrl: './uploader-excel.component.html',
  styleUrls: ['./uploader-excel.component.scss'],
})
export class UploaderExcelComponent<T> {
  @Input() fileFormatExample: string;
  @Output() onFileUpload: EventEmitter<XlsUploadResult<T>> = new EventEmitter<XlsUploadResult<T>>();

  uploaded(file: File): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const xls = XLSX.read(reader.result, { type: 'binary' });
      const data = xls.SheetNames.reduce((initial: { [key: string]: any }, name: string) => {
        initial[name] = XLSX.utils.sheet_to_json(xls.Sheets[name]);
        return initial;
      }, {});
      this.onFileUpload.emit(data);
    };
    reader.readAsBinaryString(file);
  }
}
