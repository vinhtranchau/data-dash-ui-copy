import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';

import * as _ from 'lodash';

import { IndexPrice } from '../../core/models/index.model';
import { ClientIndex, ContractType } from '../../core/models/trading-center.model';
import { TradingCenterService } from '../../core/services/trading-center.service';
import { PlotlyData } from '../graph-kit/plotly-chart.models';
import { PlotlyGraphTypes, PlotlyModeTypes, PlotlyTraceColors } from '../graph-kit/plotly-chart.options';
import { LoadingSpinner } from '../spinner/spinner';
import { IndexLibraryService } from '../../core/services/index-library.service';
import { dataDashRoute } from '../../core/routes/data-dash.route';
import { ToastService } from '../toast/toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'dd-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss'],
  animations: [
    trigger('onInit', [
      state(
        'in',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition('void => *', [style({ transform: 'translateX(-100px)', opacity: 0.5 }), animate('350ms ease-in-out')]),
    ]),
  ],
})
export class IndexCardComponent implements OnInit {
  @Input() index: ClientIndex;
  spinner: LoadingSpinner<{ loading: boolean }> = new LoadingSpinner({
    loading: 'Loading information...',
  });
  dataDashRoute = dataDashRoute;
  contractType = ContractType;

  indexPrice: IndexPrice[];
  plotData: PlotlyData[];
  startingLayout: any;
  refreshPlotLayout$: Subject<any> = new Subject<any>();
  dataX: string[];
  dataY: number[];

  constructor(
    private tradingCenterService: TradingCenterService,
    private indexLibraryService: IndexLibraryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadIndexPrices();
    this.startingLayout = {
      xaxis: { visible: false },
      yaxis: { visible: false },
      margin: {
        l: 0,
        r: 0,
        t: 0,
        b: 0,
      },
      plot_bgcolor: '#ffffff',
    };
  }

  async loadIndexPrices() {
    try {
      this.spinner.loaders.loading.show();
      this.indexPrice = await firstValueFrom(this.tradingCenterService.getIndexPrice(this.index.id));
      this.dataX = this.indexPrice.map((item) => item.stable_assigned_date);
      this.dataY = this.indexPrice.map((item) => item.price);
      this.plotData = [
        {
          x: this.dataX,
          y: this.dataY,
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          line: {
            color: this.index.last_price_change >= 0 ? PlotlyTraceColors.Primary100 : PlotlyTraceColors.Accent100,
            width: 2,
          },
          marker: {
            color: this.index.last_price_change >= 0 ? PlotlyTraceColors.Primary100 : PlotlyTraceColors.Accent100,
            size: 2,
          },
        },
      ];

      const maxY = Math.max(...this.dataY);
      const minY = Math.min(...this.dataY.filter((value) => value));
      const rangeY = maxY - minY;

      this.startingLayout = _.merge(this.startingLayout, {
        xaxis: { range: [this.dataX[0], this.dataX[this.dataX.length - 1]] },
        yaxis: { range: [minY - 0.05 * rangeY, maxY + 0.4 * rangeY] },
      });

      this.refreshPlotLayout$.next(this.startingLayout);
    } catch (e) {
    } finally {
      this.spinner.loaders.loading.hide();
    }
  }

  async updateFavorite() {
    this.index.is_favorite = !this.index.is_favorite;
    await firstValueFrom(this.indexLibraryService.postFavorite(this.index.id));
    this.toastService.success(
      (this.index.is_favorite ? 'Added ' : 'Removed ') +
        this.index.stable_index_code +
        (this.index.is_favorite ? ' to ' : ' from ') +
        'favorite indexes'
    );
  }
}
