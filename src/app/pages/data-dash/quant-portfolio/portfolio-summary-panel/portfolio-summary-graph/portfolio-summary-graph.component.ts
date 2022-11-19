import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { QuantPortfolio, QuantPortfolioPrice } from '../../../../../core/models/quant-portfolio.model';
import { QuantPortfolioService } from '../../../../../core/services/quant-portfolio.service';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyAxisTypes,
  PlotlyGraphTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { addMonths } from '../../../../../core/utils/dates.util';

@Component({
  selector: 'dd-portfolio-summary-graph',
  templateUrl: './portfolio-summary-graph.component.html',
  styleUrls: ['./portfolio-summary-graph.component.scss'],
})
export class PortfolioSummaryGraphComponent implements OnInit, OnDestroy {
  @Input() changePortfolio$: Subject<QuantPortfolio | undefined>;

  portfolio: QuantPortfolio | undefined;
  isLoading = false;

  data: PlotlyData[] = [];
  refreshLayout$ = new Subject<any>();

  private prices: QuantPortfolioPrice[] = [];
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private quantPortfolioService: QuantPortfolioService, private toast: ToastService) {}

  ngOnInit(): void {
    this.refreshLayout();
    this.changePortfolio$
      .asObservable()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res) => {
        this.portfolio = res;
        this.loadPrices().then();
      });
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private async loadPrices() {
    try {
      if (!this.portfolio) {
        return;
      }
      this.isLoading = true;
      this.prices = await firstValueFrom(this.quantPortfolioService.getQuantPortfolioPrice(this.portfolio.id));
      this.calculateGraphData();
    } catch (e) {
      this.toast.error('Failed to load plot.');
    } finally {
      this.isLoading = false;
    }
  }

  private calculateGraphData() {
    const dates = this.prices.map((x) => x.price_date);
    const prices = this.prices.map((x) => x.price);
    this.data = [
      {
        x: dates,
        y: prices,
        name: `${this.portfolio?.name} (${this.portfolio?.currency})`,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        line: { color: PlotlyTraceColors.Primary100, width: 2 },
      },
    ];
    this.refreshLayout();
  }

  private refreshLayout() {
    const plotLayout = {
      xaxis: {
        title: { text: 'Dates' },
      },
      yaxis: {
        title: { text: `${this.portfolio?.name} (${this.portfolio?.currency})` },
      },
      margin: { r: 30, t: 10 },
    };

    this.refreshLayout$.next(plotLayout);
  }
}
