import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusType } from '../../../../../../../core/models/trading-center.model';
import { dataDashRoute } from '../../../../../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-redirect-dialog',
  templateUrl: './redirect-dialog.component.html',
  styleUrls: ['./redirect-dialog.component.scss']
})
export class RedirectDialogComponent implements OnInit {
  dataDashRoute = dataDashRoute;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: StatusType },
    private matDialog: MatDialogRef<RedirectDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.matDialog.close()
  }

}
