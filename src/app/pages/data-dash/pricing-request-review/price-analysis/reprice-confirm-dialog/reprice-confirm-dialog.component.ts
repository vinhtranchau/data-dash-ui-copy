import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dd-reprice-confirm-dialog',
  templateUrl: './reprice-confirm-dialog.component.html',
  styleUrls: ['./reprice-confirm-dialog.component.scss'],
})
export class RepriceConfirmDialogComponent implements OnInit {
  form: FormGroup = this.fb.group({
    reject_reason: ['', Validators.required],
  });

  constructor(private readonly fb: FormBuilder, private dialogRef: MatDialogRef<RepriceConfirmDialogComponent>) {}

  ngOnInit(): void {}

  submit() {
    this.dialogRef.close(this.form.value);
  }
}
