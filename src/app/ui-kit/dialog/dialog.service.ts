import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(title: string, content: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '550px',
        data: { title, content },
        panelClass: 'rootModal',
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
