import { Component, Input, OnInit } from '@angular/core';

import { AlertDetail, MissingPriceUpdate } from '../../../../../core/models/alert-trigger.model';

@Component({
  selector: 'dd-missing-price-update-details',
  templateUrl: './missing-price-update-details.component.html',
  styleUrls: ['./missing-price-update-details.component.scss']
})
export class MissingPriceUpdateDetailsComponent implements OnInit {
  @Input() alert: AlertDetail;
  extraData: MissingPriceUpdate;
  
  constructor() { }

  ngOnInit(): void {
    this.extraData = this.alert.extra_data as MissingPriceUpdate;
    console.log(this.extraData);
  }

}
