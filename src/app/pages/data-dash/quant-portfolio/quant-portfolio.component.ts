import { Component, OnInit } from '@angular/core';

import { QuantPortfolioService } from '../../../core/services/quant-portfolio.service';

@Component({
  selector: 'dd-quant-portfolio',
  templateUrl: './quant-portfolio.component.html',
  styleUrls: ['./quant-portfolio.component.scss'],
})
export class QuantPortfolioComponent implements OnInit {
  constructor(private quantPortfolioService: QuantPortfolioService) {}

  ngOnInit(): void {}
}
