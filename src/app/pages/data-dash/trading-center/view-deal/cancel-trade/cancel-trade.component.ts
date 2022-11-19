import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { dataDashRoute } from '../../../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-cancel-trade',
  templateUrl: './cancel-trade.component.html',
  styleUrls: ['./cancel-trade.component.scss']
})
export class CancelTradeComponent implements OnInit {
  dataDashRoute = dataDashRoute;

  constructor(private matDialog: MatDialogRef<CancelTradeComponent>) { }

  ngOnInit(): void {
  }

  close() {
    this.matDialog.close()
  }

}
