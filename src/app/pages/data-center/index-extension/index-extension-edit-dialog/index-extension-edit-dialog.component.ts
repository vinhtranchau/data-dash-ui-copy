import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';

import { TableColumn } from '../../../../ui-kit/table/table.model';
import { ExcelIndexExtension, IndexExtension } from '../../../../core/models/index-extension.model';
import { IndexExtensionService } from '../../../../core/services/index-extension.service';
import { XlsUploadResult } from '../../../../core/models/common.model';
import { StoreService } from '../../../../core/services/store.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'dd-index-extension-edit-dialog',
  templateUrl: './index-extension-edit-dialog.component.html',
  styleUrls: ['./index-extension-edit-dialog.component.scss'],
})
export class IndexExtensionEditDialogComponent implements OnInit {
  homeUrl = environment.baseUrl;
  dialogDisabled = false;
  columns: TableColumn[] = [
    { name: 'date', content: 'date', title: 'Date', pipe: 'date' },
    { name: 'price', content: 'price', title: 'Price' },
  ];
  displayedColumns = this.columns.map((x) => x.name);
  dataSource = new MatTableDataSource<IndexExtension>([]);
  indexUUIDs$ = this.store.indexUUIDs$;

  form: UntypedFormGroup = this.fb.group({
    index_details_id: [null, [Validators.required]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: null,
    private dialogRef: MatDialogRef<IndexExtensionEditDialogComponent>,
    private toast: ToastService,
    private indexExtensionService: IndexExtensionService,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    this.store.loadIndexUUIDs();
  }

  onFileUpload(data: XlsUploadResult<ExcelIndexExtension>): void {
    // NOTE: It is supposed to have only 1 sheet
    const sheetName = Object.keys(data)[0];
    if (!sheetName) {
      this.toast.error('Invalid format of file.');
    }
    this.dataSource.data = data[sheetName]
      .filter((item) => item.date && item.price)
      .map((x) => ({
        ...x,
        date: new Date(Math.round((x.date - 25569) * 86400 * 1000)),
      }));
  }

  async save() {
    try {
      const payload = {
        index_details_id: this.form.get('index_details_id')?.value,
        extension_data: this.dataSource.data,
      };
      this.dialogDisabled = true;
      await firstValueFrom(this.indexExtensionService.postIndexExtension(payload));
      this.toast.success('Successfully saved Index Extension.');
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('There was an error saving, please contact the admins!');
    } finally {
      this.dialogDisabled = false;
    }
  }
}
