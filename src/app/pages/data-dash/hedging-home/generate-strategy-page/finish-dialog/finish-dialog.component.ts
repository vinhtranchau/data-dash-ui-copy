import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dd-finish-dialog',
  templateUrl: './finish-dialog.component.html',
  styleUrls: ['./finish-dialog.component.scss'],
})
export class FinishDialogComponent implements OnInit {
  constructor(private matDialog: MatDialogRef<FinishDialogComponent>) {}

  ngOnInit(): void {}

  close() {
    this.matDialog.close();
  }
}
