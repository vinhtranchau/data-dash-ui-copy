import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { SidebarStatusService } from '../../../../layout/dashboard-layout/sidebar-status.service';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import { PlotlyGraphTypes, PlotlyTraceColors } from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { LoadingSpinner } from '../../../../ui-kit/spinner/spinner';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-hierarchy-count-chart',
  templateUrl: './hierarchy-count-chart.component.html',
  styleUrls: ['./hierarchy-count-chart.component.scss'],
})
export class HierarchyCountChartComponent implements OnInit, OnDestroy {
  spinner: LoadingSpinner<{ sunburstChart: boolean }>;
  sunburstChartData: PlotlyData[] = [];
  refreshSunburstChartLayout$: Subject<any> = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService,
    private sidebarStatusService: SidebarStatusService
  ) {}

  ngOnInit(): void {
    this.spinner = new LoadingSpinner({
      sunburstChart: 'Loading hierarchy count chart...',
    });
    this.loadSunburstChartData();
    // To resize accordingly when sidebar shifts
    this.sidebarStatusService.isOpen$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((status) => setTimeout(this.refreshSunburstLayout, 500));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
    this.spinner.destroy();
  }

  async loadSunburstChartData() {
    try {
      this.spinner.loaders.sunburstChart.show();
      const results = await firstValueFrom(this.indexLibraryService.getHierarchyData());

      this.sunburstChartData = [
        {
          branchvalues: 'total',
          ids: results.names,
          labels: results.labels,
          marker: {
            cmid: 0.5,
            colors: results.colors,
            colorscale: [
              [0, '#F8F8F8'],
              [0.25, '#DCEDC2'],
              [1, '#A8E6CE'],
            ],
            line: { width: 1, color: PlotlyTraceColors.White },
          },
          parents: results.parents,
          values: results.counts,
          type: PlotlyGraphTypes.Sunburst,
        },
      ];
      this.refreshSunburstLayout();
    } catch (e) {
      this.toast.error('Failed to load hierarchy count chart.');
    } finally {
      this.spinner.loaders.sunburstChart.hide();
    }
  }

  refreshSunburstLayout = () => {
    this.refreshSunburstChartLayout$.next({
      margin: {
        t: 10,
        l: 10,
        r: 10,
        b: 10,
      },
    });
  };
}
