import { Component, Input, OnInit } from '@angular/core';

import { AbnormalPriceMovement, Alert, AlertDetail, AlertExplanation } from '../../../../../core/models/alert-trigger.model';

@Component({
  selector: 'dd-abnormal-price-movement-details',
  templateUrl: './abnormal-price-movement-details.component.html',
  styleUrls: ['./abnormal-price-movement-details.component.scss']
})
export class AbnormalPriceMovementDetailsComponent implements OnInit {
  @Input() alert: AlertDetail;
  extraData: AbnormalPriceMovement;
  alertExplanation = AlertExplanation;

  constructor() { }

  ngOnInit(): void {
    this.extraData = this.alert.extra_data as AbnormalPriceMovement;
  }

}
