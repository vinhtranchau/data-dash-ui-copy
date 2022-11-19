import { Component, Input, OnInit } from '@angular/core';

import { AlertDetail, HistoricalPriceCorrection } from '../../../../../core/models/alert-trigger.model';

@Component({
  selector: 'dd-historic-price-correction-details',
  templateUrl: './historic-price-correction-details.component.html',
  styleUrls: ['./historic-price-correction-details.component.scss'],
})
export class HistoricPriceCorrectionDetailsComponent implements OnInit {
  @Input() alert: AlertDetail;
  extraData: HistoricalPriceCorrection[];

  constructor() {}

  ngOnInit(): void {
    this.extraData = this.alert.extra_data as HistoricalPriceCorrection[];
  }
}
