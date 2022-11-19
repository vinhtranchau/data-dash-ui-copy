import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';

import { TradingCenterService } from '../../../../../core/services/trading-center.service';
import { IndexPrice } from '../../../../../core/models/index.model';
import { ClientIndex, RollingDealPortfolio } from '../../../../../core/models/trading-center.model';
import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import { getCurrencyAndUnit } from '../../../../../core/utils/index-detail.util';
import { removeTimezone } from '../../../../../core/utils/dates.util';
import { downloadXLS, XLSContentDataType } from '../../../../../core/utils/download-xls.util';
import * as _ from 'lodash';
import {
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHoverInfoTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { PageType, Permission } from '../utils/price-analysis.util';

@Component({
  selector: 'dd-index-price-graph',
  templateUrl: './index-price-graph.component.html',
  styleUrls: ['./index-price-graph.component.scss'],
})
export class IndexPriceGraphComponent implements OnInit {
  @Input() deal: RollingDealPortfolio;
  @Input() permission: Permission;
  @Input() index: ClientIndex;

  PageType = PageType;

  isLoading = false;
  indexPrices: IndexPrice[] = [];

  plotData: PlotlyData[] = [];
  refreshLayout$: Subject<any> = new Subject<any>();
  startingLayout = {};

  dataX: string[] = [];
  dataY: number[] = [];
  private plotLayout = {};

  constructor(private readonly tradingCenterService: TradingCenterService) {}

  ngOnInit(): void {
    this.getIndexPrice(this.deal.index.id).then();
    const currencyAndUnit = getCurrencyAndUnit(this.deal.index, true);
    this.startingLayout = {
      yaxis: { fixedrange: true, title: { text: currencyAndUnit } },
      yaxis2: { fixedrange: true },
      xaxis: { fixedrange: true },
      margin: { t: 10, r: 5 },
      legend: { y: -0.31 },
    };
  }

  private async getIndexPrice(indexId: string) {
    try {
      this.isLoading = true;
      this.indexPrices = await firstValueFrom(this.tradingCenterService.getIndexPrice(indexId));
      this.dataX = this.indexPrices.map((item) => item.stable_assigned_date);
      this.dataY = this.indexPrices.map((item) => item.price);
      this.loadPlot();
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  private loadPlot() {
    this.plotLayout = {};
    this.plotLayout = _.merge(this.plotLayout, this.startingLayout);
    const mainPlot = {
      x: this.dataX,
      y: this.dataY,
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.LinesAndMarkers,
      name: `${this.deal.index.product_id.name} (${this.deal.index.specification})`,
      hoverinfo:
        this.deal.index.public_access_level === 5 ? PlotlyHoverInfoTypes.Skip : PlotlyHoverInfoTypes.LabelAndValue,
      fill: PlotlyFillTypes.ToZeroY,
      fillcolor: PlotlyTraceColors.Transparent,
      line: { color: PlotlyTraceColors.Primary100, width: 2 },
      marker: { color: PlotlyTraceColors.Primary100, size: 2 },
    };
    this.plotData = [mainPlot];

    this.refreshLayout$.next(this.plotLayout);
  }

  downloadPricingData() {
    downloadXLS(
      `IndexPrices__${this.deal.index.stable_index_code}`,
      this.plotData
        .filter((data) => data.name && data.x)
        .map((data) => ({
          name: data.name?.slice(0, 30) || '',
          type: XLSContentDataType.Array,
          content: [['Dates', data.name], ...data.x!.map((e, i) => [removeTimezone(e), data.y![i]])],
        }))
    );
  }
}
