import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';

import { Future, Plot } from '../../../core/models/quant.model';
import { QuantService } from '../../../core/services/quant.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-derivatives-trading',
  templateUrl: './derivatives-trading.component.html',
  styleUrls: ['./derivatives-trading.component.scss'],
})
export class DerivativesTradingComponent implements OnInit {
  future: Future;
  isPlotLoading = false;
  plots$: Subject<Plot> = new Subject<Plot>();
  hasLoadError: boolean = false;

  constructor(private quantService: QuantService, private toast: ToastService) {}

  ngOnInit(): void {}

  async futureChange(future: Future) {
    try {
      this.hasLoadError = false;
      this.future = future;
      this.isPlotLoading = true;
      const res = await firstValueFrom(
        this.quantService.getInstrumentFutsPlot(future.futures_code, future.delivery_month)
      );
      this.plots$.next(res);
    } catch (e) {
      this.future = {} as any;
      this.toast.error('Failed to load futures! Please select a different instrument.');
      this.hasLoadError = true;
    } finally {
      this.isPlotLoading = false;
    }
  }
}
