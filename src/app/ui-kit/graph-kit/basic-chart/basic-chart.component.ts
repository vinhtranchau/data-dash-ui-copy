import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Plotly } from 'angular-plotly.js/lib/plotly.interface';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import * as _ from 'lodash';
import { PlotRelayoutEvent } from 'plotly.js';

@Component({
  selector: 'dd-basic-chart',
  templateUrl: './basic-chart.component.html',
  styleUrls: ['./basic-chart.component.scss'],
})
export class BasicChartComponent implements OnInit, OnDestroy {
  @Input() plotDivId: string;
  @Input() data: Plotly.Data[];
  @Input() startingLayout: Partial<Plotly.Layout>;

  @Input() rows = 1;
  @Input() columns = 1;
  @Input() subplots: [string[]] = [['xy']];

  @Input() hasRangeSlider = false;
  @Input() hasRangeSelector = false;

  @Input() fontSize = 12;
  @Input() hasLegend = false;

  @Input() refreshLayout$: Subject<any> = new Subject<any>();
  @Input() disableDoubleClick: boolean = false;

  @Output() relayout: EventEmitter<PlotRelayoutEvent> = new EventEmitter<PlotRelayoutEvent>();
  relayoutDebouncer$: Subject<PlotRelayoutEvent> = new Subject<PlotRelayoutEvent>();

  layout: Partial<Plotly.Layout>;
  config: Partial<Plotly.Config> = { displayModeBar: false, responsive: true };
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit(): void {
    this.setLayout();
    if (this.disableDoubleClick) {
      this.config['doubleClick'] = false;
    }
    this.refreshLayout$.pipe(takeUntil(this.unsubscribeAll)).subscribe((layoutChanges: Record<any, any> | null) => {
      this.setLayout();
      if (layoutChanges) {
        this.layout = _.merge(this.layout, layoutChanges); // lodash merge for nested objects
      }
    });

    this.relayoutDebouncer$
      .pipe(takeUntil(this.unsubscribeAll))
      .pipe(debounceTime(300))
      .subscribe((event) => this.relayout.emit(event));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  relayoutDebounce(event: PlotRelayoutEvent) {
    this.relayoutDebouncer$.next(event);
  }

  setLayout() {
    this.layout = {
      grid: {
        rows: this.rows,
        columns: this.columns,
        subplots: this.subplots,
        pattern: 'independent',
        xgap: 0.1,
        ygap: 0.1,
      },
      hovermode: 'x unified',
      showlegend: this.hasLegend && window.innerWidth > 786, // No legends in mobile
      legend: {
        orientation: 'h',
        yanchor: 'top',
        y: this.hasRangeSlider ? -0.55 : -0.25,
        xanchor: 'center',
        x: 0.5,
        bgcolor: 'rgba(0,0,0,0)',
        tracegroupgap: 10,
        font: {
          size: this.fontSize,
          family: 'Nunito Sans',
        },
      },
      font: {
        size: this.fontSize,
        family: 'Nunito Sans',
      },
      margin: {
        b: 50,
        t: 30,
        l: 60,
        r: 0,
      },
      autosize: true,
      yaxis: {
        tickcolor: 'white',
        ticklen: 5,
        tickwidth: 1,
        spikethickness: 1,
        tickfont: {
          size: this.fontSize,
          family: 'Nunito Sans',
        },
        title: {
          font: {
            size: this.fontSize,
            family: 'Nunito Sans',
          },
          text: null,
        },
        linewidth: 1,
        linecolor: 'white',
        gridwidth: 1,
        gridcolor: 'white',
        zerolinewidth: 1,
        zerolinecolor: 'white',
        dividerwidth: 1,
      },
      yaxis2: {
        tickcolor: 'white',
        ticklen: 5,
        tickwidth: 1,
        spikethickness: 1,
        tickfont: {
          size: this.fontSize,
          family: 'Nunito Sans',
        },
        title: {
          font: {
            size: this.fontSize,
            family: 'Nunito Sans',
          },
          text: null,
        },
        linewidth: 1,
        linecolor: 'white',
        gridwidth: 1,
        gridcolor: 'white',
        zerolinewidth: 1,
        zerolinecolor: 'white',
        dividerwidth: 1,
        side: 'right',
        overlaying: 'y',
      },
      xaxis: {
        tickcolor: 'white',
        ticklen: 5,
        tickwidth: 1,
        spikethickness: 1,
        rangeslider: {
          visible: this.hasRangeSlider,
        },
        tickfont: {
          size: this.fontSize,
          family: 'Nunito Sans',
        },
        title: {
          font: {
            size: this.fontSize,
            family: 'Nunito Sans',
          },
          text: null,
        },
        linewidth: 1,
        linecolor: 'white',
        gridwidth: 1,
        gridcolor: 'white',
        zerolinewidth: 1,
        zerolinecolor: 'white',
      },
      xaxis2: {
        tickcolor: 'white',
        ticklen: 5,
        tickwidth: 1,
        spikethickness: 1,
        rangeslider: {
          visible: this.hasRangeSlider,
        },
        tickfont: {
          size: this.fontSize,
          family: 'Nunito Sans',
        },
        title: {
          font: {
            size: this.fontSize,
            family: 'Nunito Sans',
          },
          text: null,
        },
        linewidth: 1,
        linecolor: 'white',
        gridwidth: 1,
        gridcolor: 'white',
        zerolinewidth: 1,
        zerolinecolor: 'white',
        side: 'top',
        overlaying: 'x',
      },
      plot_bgcolor: '#f9fbfd',
      paper_bgcolor: 'rgba(0,0,0,0)',
      hoverlabel: {
        bgcolor: 'rgba(255,255,255,0.5)',
        bordercolor: 'rgba(0,0,0,0.5)',
        font: {
          size: this.fontSize,
          family: 'Nunito Sans',
        },
      },
    };

    if (this.hasRangeSelector) {
      this.layout['xaxis'] = {
        ...this.layout['xaxis'],
        rangeselector: {
          font: {
            size: this.fontSize,
            family: 'Nunito Sans',
          },
          buttons: [
            {
              step: 'month',
              stepmode: 'backward',
              count: 1,
              label: '1m',
            },
            {
              step: 'month',
              stepmode: 'backward',
              count: 3,
              label: '3m',
            },
            {
              step: 'month',
              stepmode: 'backward',
              count: 6,
              label: '6m',
            },
            {
              step: 'year',
              stepmode: 'todate',
              count: 1,
              label: 'YTD',
            },
            {
              step: 'year',
              stepmode: 'backward',
              count: 1,
              label: '1y',
            },
            {
              step: 'year',
              stepmode: 'backward',
              count: 3,
              label: '3y',
            },
            {
              step: 'all',
            },
          ],
        },
      };
    }
    this.layout = _.merge(this.layout, this.startingLayout);

    // HOTFIX: After the render, range slider elements should be reordered for z-index. DD-300
    setTimeout(() => {
      try {
        const container = document.getElementsByClassName('rangeslider-container')[0];
        const sliderBox = document.getElementsByClassName('rangeslider-slidebox')[0];
        const maskMin = document.getElementsByClassName('rangeslider-mask-min')[0];
        const maskMax = document.getElementsByClassName('rangeslider-mask-max')[0];
        const grabberMin = document.getElementsByClassName('rangeslider-grabber-min')[0];
        const grabberMax = document.getElementsByClassName('rangeslider-grabber-max')[0];
        container.appendChild(sliderBox);
        container.appendChild(maskMin);
        container.appendChild(maskMax);
        container.appendChild(grabberMin);
        container.appendChild(grabberMax);
      } catch (e) {
        // Plotly graph rendering is not finished yet
      }
    }, 500);
  }
}
