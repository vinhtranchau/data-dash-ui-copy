import { Option } from './option.model';

export enum OptionTypes {
  Call = 'call',
  Put = 'put',
}

export const optionTypesOptions: Option[] = [
  {
    label: 'Call',
    id: OptionTypes.Call,
  },
  {
    label: 'Put',
    id: OptionTypes.Put,
  },
];

export enum StrikeCalculationTypes {
  AtmRatio = 'atm_ratio',
  FixedSpread = 'fixed_spread',
  MA3 = '3_ma',
  MA12 = '12_ma',
  MA24 = '24_ma',
}

export const strikeCalculationOptions: Option[] = [
  {
    label: 'ATM Ratio',
    id: StrikeCalculationTypes.AtmRatio,
  },
  {
    label: 'Fixed Spread',
    id: StrikeCalculationTypes.FixedSpread,
  },
  {
    label: '3 Months Avg',
    id: StrikeCalculationTypes.MA3,
  },
  {
    label: '12 Months Avg',
    id: StrikeCalculationTypes.MA12,
  },
  {
    label: '24 Months Avg',
    id: StrikeCalculationTypes.MA24,
  },
];

export enum SellingMonths {
  AllMonths = 'all_months',
  Jan = 0,
  Feb = 1,
  Mar = 2,
  Apr = 3,
  May = 4,
  Jun = 5,
  Jul = 6,
  Aug = 7,
  Sep = 8,
  Oct = 9,
  Nov = 10,
  Dec = 11,
}

export const sellingMonthsOptions: Option[] = [
  {
    label: 'All Months',
    id: SellingMonths.AllMonths,
  },
  {
    label: 'Jan',
    id: SellingMonths.Jan,
  },
  {
    label: 'Feb',
    id: SellingMonths.Feb,
  },
  {
    label: 'Mar',
    id: SellingMonths.Mar,
  },
  {
    label: 'Apr',
    id: SellingMonths.Apr,
  },
  {
    label: 'May',
    id: SellingMonths.May,
  },
  {
    label: 'Jun',
    id: SellingMonths.Jun,
  },
  {
    label: 'Jul',
    id: SellingMonths.Jul,
  },
  {
    label: 'Aug',
    id: SellingMonths.Aug,
  },
  {
    label: 'Sep',
    id: SellingMonths.Sep,
  },
  {
    label: 'Oct',
    id: SellingMonths.Oct,
  },
  {
    label: 'Nov',
    id: SellingMonths.Nov,
  },
  {
    label: 'Dec',
    id: SellingMonths.Dec,
  },
];

export function startingDelayOptions(months: number = 24): Option[] {
  return [
    ...[...Array(months).keys()].map((number) => ({
      label: `${number} Months`,
      id: number,
    })),
  ];
}

export function durationOptions(months: number = 24): Option[] {
  return [
    ...[...Array(months).keys()].map((number) => ({
      label: `${number + 1} Month${number > 0 ? 's' : ''}`,
      id: number + 1,
    })),
  ];
}

export interface EmSICData {
  dates: string;
  limit_price: number;
  strike_price: number;
  moving_average?: number;
}

export interface StrikeLimitData {
  config_number: number;
  sic_data: EmSICData[];
}

export interface EmPercentileTable {
  '1st %': number;
  '5th %': number;
  '25th %': number;
  '50th %': number;
  '75th %': number;
  '95th %': number;
  '99th %': number;
}

export interface EmStatsTable {
  '% > 0': number;
  Kurtosis: number;
  Skew: number;
  Max: number;
  Min: number;
  Mean: number;
  Std: number;
}

export interface EmTotalPayoff {
  dates: string;
  net_position: number;
  pay_off: number;
}

export interface EmHistoricalPayoff {
  config_number: number;
  contract_size: number;
  dates: string;
  limit_price: number;
  net_position: number;
  option_type: string;
  pay_off: number;
  policy_start: string;
  policy_end: string;
  settlement_price: number;
  spot_price: number;
  strike_price: number;
}

export interface SICData {
  dates: string;
  spot_price: number;
}

export interface EmpiricalModellingResults {
  sic_data: SICData[];
  hist_curve_x: number[];
  hist_curve_y: number[];
  strike_limit_data: StrikeLimitData[];
  net_pos_acf: number[];
  net_pos_pacf: number[];
  net_pos_stats: [EmPercentileTable, EmStatsTable];
  net_pos_stats_emp: [EmPercentileTable, EmStatsTable];
  pay_off_stats: [EmPercentileTable, EmStatsTable];
  positive_pay_off_stats: [EmPercentileTable, EmStatsTable];
  pay_off_stats_emp: [EmPercentileTable, EmStatsTable];
  positive_pay_off_stats_emp: [EmPercentileTable, EmStatsTable];
  total_payoff: EmTotalPayoff[];
  historical_payoff_table_data: EmHistoricalPayoff[];
}
