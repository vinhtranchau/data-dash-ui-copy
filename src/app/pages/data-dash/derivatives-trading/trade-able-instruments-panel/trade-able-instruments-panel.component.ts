import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { QuantService } from '../../../../core/services/quant.service';
import { Future, FutureGroup } from '../../../../core/models/quant.model';

@Component({
  selector: 'dd-trade-able-instruments-panel',
  templateUrl: './trade-able-instruments-panel.component.html',
  styleUrls: ['./trade-able-instruments-panel.component.scss'],
})
export class TradeAbleInstrumentsPanelComponent implements OnInit {
  @Input() selectedFuture: Future | null;
  @Output() futureChange = new EventEmitter<Future>();

  futureGroups: FutureGroup[] = [];
  isLoading = false;

  constructor(private quantService: QuantService) {}

  ngOnInit(): void {
    this.getInstruments().then();
  }

  async getInstruments() {
    try {
      this.isLoading = true;
      this.futureGroups = await firstValueFrom(this.quantService.getInstrumentFuts());
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  select(future: Future) {
    this.futureChange.emit(future);
  }
}
