import { Component, Input, OnInit } from '@angular/core';

import { HedgingStrategyDetail } from '../../../../../core/models/hedging.model';
import { dataDashRoute } from '../../../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-strategy-detail',
  templateUrl: './strategy-detail.component.html',
  styleUrls: ['./strategy-detail.component.scss'],
})
export class StrategyDetailComponent implements OnInit {
  @Input() strategy: HedgingStrategyDetail;
  @Input() isLoading = false;

  dataDashRoute = dataDashRoute;

  constructor() {}

  ngOnInit(): void {}
}
