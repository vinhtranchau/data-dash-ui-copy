import { OptionValue } from './option.model';

export interface AggregationSplit {
  label: string;
  count: number;
  total_premium: number;
  total_claims_paid: number | null;
}

export interface NewAggregationSplit {
  direction: OptionValue[];
  product: OptionValue[];
  sic: OptionValue[];
}

export interface PortfolioStatistics {
  direction: AggregationSplit[];
  product: AggregationSplit[];
  sic: AggregationSplit[];
}

export interface portfolioSummaryTableRow {
  account: string;
  value: string;
}
