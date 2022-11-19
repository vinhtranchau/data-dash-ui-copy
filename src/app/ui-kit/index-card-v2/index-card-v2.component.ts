import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

import * as _ from 'lodash';

import { IndexPrice } from '../../core/models/index.model';
import { ClientIndex, ContractType } from '../../core/models/trading-center.model';
import { PlotlyData } from '../graph-kit/plotly-chart.models';
import { PlotlyGraphTypes, PlotlyModeTypes, PlotlyTraceColors } from '../graph-kit/plotly-chart.options';
import { LoadingSpinner } from '../spinner/spinner';
import { dataDashRoute } from '../../core/routes/data-dash.route';
import { TradingCenterService } from '../../core/services/trading-center.service';
import { IndexLibraryService } from '../../core/services/index-library.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'dd-index-card-v2',
  templateUrl: './index-card-v2.component.html',
  styleUrls: ['./index-card-v2.component.scss'],
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
    trigger('onHover', [
      state(
        'in',
        style({
          transform: 'translate(-50%,-50%) scale(1)',
          opacity: 1,
        })
      ),
      transition('void => *', [
        style({ transform: 'translate(-50%,-50%) scale(0.3)', opacity: 0.3 }),
        animate('250ms ease-in-out'),
      ]),
    ]),
  ],
})
export class IndexCardV2Component implements OnInit, OnDestroy {
  @Input() index: ClientIndex;

  contractType = ContractType;
  dataDashRoute = dataDashRoute;
  spinner: LoadingSpinner<{ loading: boolean }> = new LoadingSpinner({
    loading: 'Loading...',
  });
  isHover = false;

  indexPrice: IndexPrice[] = [];
  plotData: PlotlyData[] = [];
  startingLayout: any;
  refreshPlotLayout$: Subject<any> = new Subject<any>();
  dataX: string[];
  dataY: number[];

  changeState$: Subject<any> = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private tradingCenterService: TradingCenterService,
    private indexLibraryService: IndexLibraryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.changeState$
      .asObservable()
      .pipe(takeUntil(this.unsubscribeAll), debounceTime(50))
      .subscribe((state) => {
        this.isHover = state;
        if (this.isHover && !this.indexPrice.length) {
          this.loadIndexPrices();
        }
      });

    this.indexPrice = [];
    this.plotData = [];
    this.startingLayout = {
      xaxis: { visible: false },
      yaxis: { visible: false },
      margin: {
        l: 0,
        r: 0,
        t: 0,
        b: 0,
      },
      plot_bgcolor: '#f1f5f9',
    };
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
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
          type: PlotlyGraphTypes.ScatterGl,
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
