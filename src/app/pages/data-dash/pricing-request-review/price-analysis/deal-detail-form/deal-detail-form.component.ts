import { Component, Input, OnInit } from '@angular/core';

import { RollingDealPortfolio } from '../../../../../core/models/trading-center.model';

@Component({
  selector: 'dd-deal-detail-form',
  templateUrl: './deal-detail-form.component.html',
  styleUrls: ['./deal-detail-form.component.scss']
})
export class DealDetailFormComponent implements OnInit {
  @Input() deal: RollingDealPortfolio;

  constructor() { }

  ngOnInit(): void {
  }

}
