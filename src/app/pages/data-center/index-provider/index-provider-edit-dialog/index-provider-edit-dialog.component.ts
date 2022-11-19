import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { accessDataOptions, IndexProvider, IndexProviderStatus } from '../../../../core/models/index.model';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { IndexProviderService } from '../../../../core/services/index-provider.service';
import { enumToOptions } from '../../../../core/utils/enum.util';

@Component({
  selector: 'dd-index-provider-edit-dialog',
  templateUrl: './index-provider-edit-dialog.component.html',
  styleUrls: ['./index-provider-edit-dialog.component.scss'],
})
export class IndexProviderEditDialogComponent implements OnInit {
  dialogDisabled = false;
  StatusOptions = enumToOptions(IndexProviderStatus);
  accessDataOptions = accessDataOptions;

  form: UntypedFormGroup = this.fb.group({
    id: [this.data.id],
    name: [this.data.name, [Validators.required, Validators.maxLength(100)]],
    status: [this.data.status, [Validators.required]],
    public_access: [this.data.public_access, [Validators.required]],
    trusted_access: [this.data.trusted_access, [Validators.required]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IndexProvider,
    private dialogRef: MatDialogRef<IndexProviderEditDialogComponent>,
    private toast: ToastService,
    private indexProviderService: IndexProviderService
  ) {}

  ngOnInit(): void {}

  async save() {
    try {
      const payload = this.form.value;
      this.form.disable();
      this.dialogDisabled = true;
      if (payload.id) {
        await firstValueFrom(this.indexProviderService.updateIndexProvider(payload));
      } else {
        await firstValueFrom(this.indexProviderService.createIndexProvider(payload));
      }

      this.toast.success('Successfully saved Index Provider.');
      this.dialogRef.close(true);
    } catch (e: any) {
      this.toast.apiErrorResponse(e);
    } finally {
      this.form.enable();
      this.dialogDisabled = false;
    }
  }
}
