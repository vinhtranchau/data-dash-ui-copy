import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { dataDashRoute } from '../../../../../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-request-pricing-dialog',
  templateUrl: './request-pricing-dialog.component.html',
  styleUrls: ['./request-pricing-dialog.component.scss'],
})
export class RequestPricingDialogComponent implements OnInit {
  dataDashRoute = dataDashRoute;

  constructor(private matDialog: MatDialogRef<RequestPricingDialogComponent>) {}

  ngOnInit(): void {}

  close() {
    this.matDialog.close();
  }
}
