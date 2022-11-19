import {
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHistNormTypes,
  PlotlyHoverInfoTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from './plotly-chart.options';

// Plotly will automatically generate colors if color is not specified
export interface PlotlyLine {
  color?: PlotlyTraceColors | string;
  dash?: PlotlyLineDashTypes;
  width?: number;
}

export interface PlotlyMarker {
  color?: PlotlyTraceColors | string;
  size?: number;
  line?: PlotlyLine;
  cmid?: number;
  colors?: PlotlyTraceColors[] | number[];
  colorscale?: any[];
}

export interface PlotlyLeaf {
  opacity?: number;
}

// A lot of other properties - add them as we use more graph types
export interface PlotlyData {
  x?: any[];
  y?: any[];
  type?: PlotlyGraphTypes;
  mode?: PlotlyModeTypes;
  width?: number[];
  name?: string;
  hovertemplate?: string[];
  line?: PlotlyLine;
  marker?: PlotlyMarker;
  visible?: boolean;
  yaxis?: PlotlyAxisTypes;
  xaxis?: PlotlyAxisTypes;
  hoverinfo?: PlotlyHoverInfoTypes;
  fill?: PlotlyFillTypes;
  fillcolor?: PlotlyTraceColors;
  nbinsx?: number;
  histnorm?: PlotlyHistNormTypes;
  opacity?: number;
  row?: number;
  col?: number;
  orientation?: string;
  ids?: string[];
  labels?: string[];
  parents?: string[];
  values?: number[];
  branchvalues?: string;
  id?: string;

  open?: number[];
  high?: number[];
  low?: number[];
  close?: number[];
  increasing?: { line: PlotlyLine };
  decreasing?: { line: PlotlyLine };

  hole?: number;
  textinfo?: PlotlyHoverInfoTypes;
}
