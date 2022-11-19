import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Subject } from 'rxjs';

import { QuantPortfolioService } from '../../../../core/services/quant-portfolio.service';
import { QuantPortfolio } from '../../../../core/models/quant-portfolio.model';

@Component({
  selector: 'dd-portfolio-summary-panel',
  templateUrl: './portfolio-summary-panel.component.html',
  styleUrls: ['./portfolio-summary-panel.component.scss'],
})
export class PortfolioSummaryPanelComponent implements OnInit {
  dataSource: MatTableDataSource<QuantPortfolio> = new MatTableDataSource<QuantPortfolio>([]);
  isLoading = false;

  selectedPortfolio: QuantPortfolio | undefined;
  changePortfolio$: Subject<QuantPortfolio | undefined> = new Subject<QuantPortfolio | undefined>();

  constructor(private quantPortfolioService: QuantPortfolioService) {}

  ngOnInit(): void {
    this.loadQuantPortfolio().then();
  }

  changeSelection(quantPortfolio: QuantPortfolio | undefined) {
    this.selectedPortfolio = quantPortfolio;
    this.changePortfolio$.next(this.selectedPortfolio);
  }

  private async loadQuantPortfolio() {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.quantPortfolioService.getQuantPortfolio());
      this.dataSource.data = res.results;
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }
}
