import { Component, Input, OnInit } from '@angular/core';
import { getPercentage } from '../../../../../core/utils/number.util';

@Component({
  selector: 'dd-price-change-header',
  templateUrl: './price-change-header.component.html',
  styleUrls: ['./price-change-header.component.scss']
})
export class PriceChangeHeaderComponent implements OnInit {
  @Input() startPrice: number | null;
  @Input() endPrice: number | null;
  @Input() startDate: number | null;
  @Input() endDate: number | null;

  constructor() { }

  ngOnInit(): void {}

}
