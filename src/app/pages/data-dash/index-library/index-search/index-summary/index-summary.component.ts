import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { IndexSummary } from '../../../../../core/models/index.model';
import { IndexLibraryService } from '../../../../../core/services/index-library.service';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyGraphTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { parseIndexPrices } from '../../../../../ui-kit/graph-kit/plotly-chart.utils';
import { standaloneModalRoute } from '../../../../../core/routes/standalone-modal.route';
import { LoadingSpinner } from '../../../../../ui-kit/spinner/spinner';
import { CommonService } from '../../../../../core/services/common.service';

@Component({
  selector: 'dd-index-summary',
  templateUrl: './index-summary.component.html',
  styleUrls: ['./index-summary.component.scss'],
})
export class DDIndexSummary implements OnInit {
  @Input() index: IndexSummary;
  spinner: LoadingSpinner<{ loading: boolean }> = new LoadingSpinner({
    loading: 'Loading information...',
  });
  data: PlotlyData[] = [];
  indexPrices: PlotlyData = {};
  standaloneModalRoute = standaloneModalRoute;
  refreshPlotLayout$: Subject<any> = new Subject<any>();

  constructor(
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadIndexPrice();
  }

  async loadIndexPrice() {
    try {
      this.spinner.loaders.loading.show();
      const results = await firstValueFrom(this.indexLibraryService.getIndexPrices(this.index.id));
      const { x, y, hoverTemplate, extensionX, extensionY } = parseIndexPrices(results);

      this.indexPrices = {
        x: x,
        y: y,
        type: PlotlyGraphTypes.ScatterGl,
        mode: PlotlyModeTypes.LinesAndMarkers,
        line: { color: PlotlyTraceColors.Primary100, width: 2 },
        marker: { color: PlotlyTraceColors.Primary100, size: 2 },
      };
      this.data = [this.indexPrices];
      this.refreshPlotLayout$.next({
        margin: {
          l: 30,
        },
      });
    } catch (e) {
      this.toast.error('Failed to load index price chart.');
    } finally {
      this.spinner.loaders.loading.hide();
    }
  }

  routeIndex(tab: number) {
    const indexIdUrl = `${standaloneModalRoute.root}/${standaloneModalRoute.indexDetails}/${this.index.id}/${tab}`;
    this.commonService.openStandaloneModal(indexIdUrl);
  }

  updateFavorite() {
    this.index.is_favorite = !this.index.is_favorite;
    firstValueFrom(this.indexLibraryService.postFavorite(this.index.id));
  }
}
