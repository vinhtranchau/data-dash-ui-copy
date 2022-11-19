import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { Nation } from '../../../../core/models/nation.model';
import { NationService } from '../../../../core/services/nation.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-nation-edit-dialog',
  templateUrl: './nation-edit-dialog.component.html',
  styleUrls: ['./nation-edit-dialog.component.scss'],
})
export class NationEditDialogComponent implements OnInit {
  isLoading = false;

  form: UntypedFormGroup = this.fb.group({
    id: [this.data.id],
    code: [this.data.code, [Validators.required, Validators.maxLength(6)]],
    name: [this.data.name, [Validators.required, Validators.maxLength(100)]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Nation,
    private dialogRef: MatDialogRef<NationEditDialogComponent>,
    private toast: ToastService,
    private nationService: NationService
  ) {}

  ngOnInit(): void {}

  async save() {
    try {
      const payload = this.form.value;
      this.form.disable();
      this.isLoading = true;
      if (this.data.id) {
        await firstValueFrom(this.nationService.updateNation(payload));
      } else {
        await firstValueFrom(this.nationService.createNation(payload));
      }
      this.toast.success('Successfully saved nation.');
      this.dialogRef.close(true);
    } catch (e: any) {
      this.toast.apiErrorResponse(e);
    } finally {
      this.form.enable();
      this.isLoading = false;
    }
  }
}
