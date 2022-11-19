import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { FavoriteBy, IndexPopular, PeriodPopularIndex } from '../../../../core/models/index.model';
import { standaloneModalRoute } from '../../../../core/routes/standalone-modal.route';
import { CommonService } from '../../../../core/services/common.service';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { enumToOptions } from '../../../../core/utils/enum.util';
import { isUUID } from '../../../../core/validators/is-uuid';
import { SidebarStatusService } from '../../../../layout/dashboard-layout/sidebar-status.service';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import { colorArray, PlotlyAxisTypes, PlotlyGraphTypes } from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { LoadingSpinner } from '../../../../ui-kit/spinner/spinner';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-popular-indexes-graph',
  templateUrl: './popular-indexes-graph.component.html',
  styleUrls: ['./popular-indexes-graph.component.scss'],
})
export class PopularIndexesGraphComponent implements OnInit, OnDestroy {
  spinner: LoadingSpinner<{ indexPopular: boolean }>;
  indexPopularData: PlotlyData[] = [];
  PeriodPopularOptions = enumToOptions(PeriodPopularIndex);
  selectedValue = PeriodPopularIndex.AllTime;
  refreshPopularIndexLayout$ = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService,
    private commonService: CommonService,
    private sidebarStatusService: SidebarStatusService
  ) {}

  @HostListener('click', ['$event']) onClick(event: any) {
    const id = event?.srcElement?.href?.baseVal;

    if (event?.srcElement?.nodeName === 'a' && id && isUUID(id)) {
      event.preventDefault();
      this.openIndexModal(id);
    }
  }

  ngOnInit(): void {
    this.spinner = new LoadingSpinner({
      indexPopular: 'Loading most popular indexes...',
    });
    this.loadPopularIndexChart(this.selectedValue);
    // To resize accordingly when sidebar shifts
    this.sidebarStatusService.isOpen$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((status) => setTimeout(this.refreshLayout, 500));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
    this.spinner.destroy();
  }

  async loadPopularIndexChart(period: PeriodPopularIndex) {
    try {
      this.spinner.loaders.indexPopular.show();
      const results = await firstValueFrom(this.indexLibraryService.getPopularIndexes(period));

      const dataChart: PlotlyData[] = [];
      let count = 0;

      results.forEach((item: IndexPopular) => {
        item.favorite_by.forEach((fav: FavoriteBy) => {
          const x: number[] = [];
          const y: string[] = [];

          const findIndex = dataChart.findIndex((dta: any) => dta.id === fav.log_by);
          if (findIndex === -1) {
            x.push(fav.favorite);
            y.push(`<a href="${item.index_details}">${item.stable_index_code}</a>`);
            dataChart.push({
              id: fav.log_by,
              name: fav.name,
              x: x,
              y: y,
              orientation: 'h',
              type: PlotlyGraphTypes.Bar,
              xaxis: PlotlyAxisTypes.X,
              yaxis: PlotlyAxisTypes.Y,
              marker: { color: colorArray[count], line: { width: 0 } },
            });
            count += 1;
          } else {
            const currentX = dataChart[findIndex].x;
            currentX?.push(fav.favorite);
            const currentY = dataChart[findIndex].y;
            currentY?.push(`<a href="${item.index_details}">${item.stable_index_code}</a>`);
            dataChart[findIndex] = {
              ...dataChart[findIndex],
              x: currentX,
              y: currentY,
            };
          }
        });
      });
      this.indexPopularData = [...dataChart];
      this.refreshLayout();
    } catch (e) {
      this.toast.error('Failed to load popular indexes.');
    } finally {
      this.spinner.loaders.indexPopular.hide();
    }
  }

  refreshLayout = () => {
    this.refreshPopularIndexLayout$.next({
      barmode: 'stack',
      margin: { r: 0, t: 10 },
      xaxis: { title: { text: 'Views' } },
      hovermode: 'closest',
    });
  };

  changePeriod(period: PeriodPopularIndex) {
    this.loadPopularIndexChart(period);
  }

  openIndexModal(id: string) {
    const indexIdUrl = `${standaloneModalRoute.root}/${standaloneModalRoute.indexDetails}/${id}/${0}`;
    this.commonService.openStandaloneModal(indexIdUrl);
  }
}
