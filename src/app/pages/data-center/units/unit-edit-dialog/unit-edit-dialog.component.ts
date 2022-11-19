import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { Unit } from '../../../../core/models/unit.model';
import { UnitService } from '../../../../core/services/unit.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-unit-edit-dialog',
  templateUrl: './unit-edit-dialog.component.html',
  styleUrls: ['./unit-edit-dialog.component.scss'],
})
export class UnitEditDialogComponent implements OnInit {
  isLoading = false;

  form: UntypedFormGroup = this.fb.group({
    id: [this.data.id],
    units: [this.data.units, [Validators.required, Validators.maxLength(100)]],
    units_plural: [this.data.units_plural, [Validators.required, Validators.maxLength(100)]],
    abbreviations: [this.data.abbreviations, [Validators.required, Validators.maxLength(100)]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Unit,
    private dialogRef: MatDialogRef<UnitEditDialogComponent>,
    private toast: ToastService,
    private unitService: UnitService
  ) {}

  ngOnInit(): void {}

  async save() {
    try {
      const payload = this.form.value;
      this.form.disable();
      this.isLoading = true;
      if (this.data.id) {
        await firstValueFrom(this.unitService.updateUnit(payload));
      } else {
        await firstValueFrom(this.unitService.createUnit(payload));
      }
      this.toast.success('Successfully saved units.');
      this.dialogRef.close(true);
    } catch (e: any) {
      this.toast.apiErrorResponse(e);
    } finally {
      this.form.enable();
      this.isLoading = false;
    }
  }
}
