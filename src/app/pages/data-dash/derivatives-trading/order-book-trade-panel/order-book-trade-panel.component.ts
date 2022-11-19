import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { Future, OrderBookInfo, Plot, Side } from '../../../../core/models/quant.model';
import { QuantService } from '../../../../core/services/quant.service';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyGraphTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-order-book-trade-panel',
  templateUrl: './order-book-trade-panel.component.html',
  styleUrls: ['./order-book-trade-panel.component.scss'],
})
export class OrderBookTradePanelComponent implements OnInit, OnDestroy {
  @Input() isLoadingPlots = false;
  @Input() future: Future;
  @Input() plots$: Subject<Plot> = new Subject<Plot>();
  @Input() hasLoadError: boolean;

  Side = Side;

  isLoadingOrderBookStatus = false;
  isLoadingOrderBookPlot = false;
  isProcessingTrade = false;
  info: OrderBookInfo = { available_usd: 0, margin: 0, pnl: 0 };

  plotData: PlotlyData[];
  startingLayout = {
    xaxis: { title: { text: 'Price' } },
    yaxis: { title: { text: 'Volume' } },
    margin: { t: 5, r: 30 },
  };
  refreshLayout$: Subject<any> = new Subject<any>();

  form: UntypedFormGroup = this.fb.group({
    price: [null, Validators.required],
    quantity: [null, Validators.required],
    stop: [null, Validators.required],
    limit: [null, Validators.required],
  });

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private quantService: QuantService, private toast: ToastService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.plots$.pipe(takeUntil(this.unsubscribeAll)).subscribe(async (plots) => {
      // After fetching the plots, we are getting order book trade information
      await this.loadOrderBookTradeInformation();
      await this.loadOrderBookTradePlot();
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  async trade(side: Side) {
    try {
      this.isProcessingTrade = true;
      const { price, quantity, stop, limit } = this.form.value;
      await firstValueFrom(
        this.quantService.trade(
          this.future.futures_code,
          this.future.delivery_month,
          price,
          quantity,
          stop,
          limit,
          side
        )
      );
      this.toast.success('Your request has been submitted successfully.');
      this.form.reset();
    } catch (e) {
      this.toast.error('Failed to process your request.');
    } finally {
      this.isProcessingTrade = false;
    }
  }

  private async loadOrderBookTradeInformation() {
    try {
      this.isLoadingOrderBookStatus = true;
      const { futures_code, delivery_month } = this.future;
      this.info = await firstValueFrom(this.quantService.getOrderBookTradeInformation(futures_code, delivery_month));
    } catch (e) {
      this.toast.error('Failed to get trade information.');
    } finally {
      this.isLoadingOrderBookStatus = false;
    }
  }

  private async loadOrderBookTradePlot() {
    try {
      this.isLoadingOrderBookPlot = true;
      const results = await firstValueFrom(this.quantService.getOrderBookTradePlot());
      this.plotData = [
        {
          x: results.bid_price,
          y: results.bid_size,
          type: PlotlyGraphTypes.Scatter,
          name: 'Bid',
          mode: PlotlyModeTypes.Lines,
          line: { color: PlotlyTraceColors.Primary100, width: 2 },
        },
        {
          x: results.ask_price,
          y: results.ask_size,
          type: PlotlyGraphTypes.Scatter,
          name: 'Ask',
          mode: PlotlyModeTypes.Lines,
          line: { color: PlotlyTraceColors.Accent100, width: 2 },
        },
      ];
      this.refreshLayout$.next(this.startingLayout);
    } catch (e) {
      this.toast.error('Failed to load order book plot.');
    } finally {
      this.isLoadingOrderBookPlot = false;
    }
  }
}
