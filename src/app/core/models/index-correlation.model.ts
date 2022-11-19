import { Index, IndexPrice } from './index.model';

export interface IndexCorrelationSummary extends Index {
  index_details_id: string;
  product_id_name: string;
  index_provider_id_name: string;
  num_data_points_overlap: number;
  original_currency_3y_correlation: number;
  original_currency_3y_correlation_log_diff: number;
  original_currency_correlation: number;
  original_currency_correlation_log_diff: number;
}

export interface ScatterData {
  x: number[];
  y: number[];
}

export interface SmoothedHistogramData {
  x: number[];
  y: number[];
}

export interface ComparisonChartsData {
  index_1_price: IndexPrice[];
  index_1_monthly_price: IndexPrice[];
  index_2_price: IndexPrice[];
  index_2_monthly_price: IndexPrice[];
  index_2_adj_price: IndexPrice[];
  index_2_monthly_adj_price: IndexPrice[];
  scatter_data: ScatterData;
  monthly_scatter_data: ScatterData;
  basis_price: IndexPrice[];
  monthly_basis_price: IndexPrice[];
  adj_basis_price: IndexPrice[];
  monthly_adj_basis_price: IndexPrice[];
  basis_acf: number[];
  basis_pacf: number[];
  adj_basis_acf: number[];
  adj_basis_pacf: number[];
  monthly_basis_acf: number[];
  monthly_basis_pacf: number[];
  monthly_adj_basis_acf: number[];
  monthly_adj_basis_pacf: number[];
  adj_basis_coefficient: number;
  monthly_adj_basis_coefficient: number;
  basis_histogram: SmoothedHistogramData;
  monthly_basis_histogram: SmoothedHistogramData;
  adj_basis_histogram: SmoothedHistogramData;
  monthly_adj_basis_histogram: SmoothedHistogramData;
  correlation: number;
  monthly_correlation: number;
}
