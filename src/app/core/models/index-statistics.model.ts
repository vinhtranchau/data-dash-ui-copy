import { Months } from './dates.model';

export interface IndexStatistics {
  latest_price: number;
  latest_price_date: string;
  starting_price_date: string;
  weekly_price: number;
  weekly_price_date: string;
  weekly_change: number;
  weekly_percentage_change: number | string;
  weekly_average: number;
  weekly_high: number;
  weekly_low: number;
  monthly_price: number;
  monthly_price_date: string;
  monthly_change: number;
  monthly_percentage_change: number | string;
  monthly_average: number;
  monthly_high: number;
  monthly_low: number;
  yearly_price: number;
  yearly_price_date: string;
  yearly_change: number;
  yearly_percentage_change: number | string;
  yearly_average: number;
  yearly_high: number;
  yearly_low: number;
  starting_price: number;
  starting_change: number;
  starting_percentage_change: number | string;
  starting_average: number;
  starting_high: number;
  starting_low: number;
  min_price: number;
  min_price_date: string;
  max_price: number;
  max_price_date: string;
}

export interface HistoricalEWMAVol {
  stable_assigned_date: string;
  vol: number;
}

export interface IndexSeasonalityForecast {
  stable_assigned_date: string;
  forecasted_price: number;
  fitted_pattern: number;
}

export interface SarimaForecast {
  stable_assigned_date: string;
  predicted_mean: number;
  lower_price: number;
  upper_price: number;
}

export enum StatisticType {
  Low = 'Low',
  High = 'High',
  Average = 'Average',
  Median = 'Median',
  Std = 'Std',
}

export interface MonthlyStatistics extends Months {
  Statistic: StatisticType;
}

export interface MonthlyStatisticsDate {
  Statistic: StatisticType;
  Jan: string | null;
  Feb: string | null;
  Mar: string | null;
  Apr: string | null;
  May: string | null;
  Jun: string | null;
  Jul: string | null;
  Aug: string | null;
  Sep: string | null;
  Oct: string | null;
  Nov: string | null;
  Dec: string | null;
}

export interface PriceChangeRatios extends Months {
  Maturity: number;
}

export interface SeasonalStatistics {
  monthly_stats_records: MonthlyStatistics[];
  monthly_stats_date_records: MonthlyStatisticsDate[];
  price_change_ratio_mean_records: PriceChangeRatios[];
  price_change_ratio_std_records: PriceChangeRatios[];
}

export interface YearlySeasonality extends Months {
  Year: number;
}
