import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { Currency } from '../../../../core/models/currency.model';
import { CurrencyService } from '../../../../core/services/currency.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-currency-edit-dialog',
  templateUrl: './currency-edit-dialog.component.html',
  styleUrls: ['./currency-edit-dialog.component.scss'],
})
export class CurrencyEditDialogComponent implements OnInit {
  isLoading = false;

  form: UntypedFormGroup = this.fb.group({
    id: [this.data.id],
    code: [this.data.code, [Validators.required, Validators.maxLength(6)]],
    name: [this.data.name, [Validators.required, Validators.maxLength(100)]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Currency,
    private dialogRef: MatDialogRef<CurrencyEditDialogComponent>,
    private toast: ToastService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {}

  async save() {
    try {
      const payload = this.form.value;
      this.form.disable();
      this.isLoading = true;
      if (this.data.id) {
        await firstValueFrom(this.currencyService.updateCurrency(payload));
      } else {
        await firstValueFrom(this.currencyService.createCurrency(payload));
      }
      this.toast.success('Successfully saved currency.');
      this.dialogRef.close(true);
    } catch (e: any) {
      this.toast.apiErrorResponse(e);
    } finally {
      this.form.enable();
      this.isLoading = false;
    }
  }
}
