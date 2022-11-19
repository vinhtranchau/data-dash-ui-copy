import { enumToOptions } from '../utils/enum.util';
import { IndexUUID } from './index.model';

export enum DealDirection {
  Call = 'call',
  Put = 'put',
}

export const dealDirectionOptions = enumToOptions(DealDirection);

export enum DealStyle {
  Asian = 'asian',
  European = 'european',
}

export const dealStyleOptions = enumToOptions(DealStyle);

export interface UnderlyingDetail {
  product: string;
  description: string;
  sic: string;
  url: string;
}

export interface DealDetail {
  direction: DealDirection;
  style: DealStyle;
  quantity: number;
  strike: number;
  limit: number;
  stop: number;
  purchase_date: string;
  coverage_start: string;
  coverage_end: string;
}

export interface Position {
  index: IndexUUID;
  deal_config: DealDetail;

  label?: string; // Will be added while rendering
}

export enum RiskMeasure {
  VaR = 'var',
  ES_CVaR = 'es_cvar',
  StandardDeviation = 'standard_deviation',
  DownsideDeviation = 'downside_deviation',
}

export const riskMeasureOptions = [
  { label: 'VaR', value: RiskMeasure.VaR },
  { label: 'ES/CVaR', value: RiskMeasure.ES_CVaR },
  { label: 'Standard Deviation', value: RiskMeasure.StandardDeviation },
  { label: 'Downside Deviation', value: RiskMeasure.DownsideDeviation },
];

export enum Style {
  Static = 'static',
  Dynamic = 'dynamic',
}

export const styleOptions = [
  { label: 'Static', value: Style.Static },
  { label: 'Dynamic', value: Style.Dynamic },
];

export enum Method {
  GreekBasedHedging = 'GBM',
  DeepHedgingMLP = 'MLP',
  DeepHedgingRNN = 'RNN',
}

export const methodOptions = [
  { label: 'Greek-based hedging (GBM)', value: Method.GreekBasedHedging },
  { label: 'Deep Hedging (MLP)', value: Method.DeepHedgingMLP },
  { label: 'Deep hedging (RNN)', value: Method.DeepHedgingRNN },
];

export enum ScenarioGenerator {
  HS_BackTesting = 'HS/Backtesting',
  fHS = 'fHS',
  fHS_B = 'fHS-B',
  GBM = 'GBM',
  SARIMA = 'SARIMA',
}

export const scenarioGeneratorOptions = [
  { label: 'HS/Backtesting', value: ScenarioGenerator.HS_BackTesting },
  { label: 'fHS', value: ScenarioGenerator.fHS },
  { label: 'fHS-B', value: ScenarioGenerator.fHS_B },
  { label: 'GBM', value: ScenarioGenerator.GBM },
  { label: 'SARIMA', value: ScenarioGenerator.SARIMA },
];

export interface HedgingControl {
  risk_measure: RiskMeasure;
  confidence_level: number;
  threshold: number;
  hedging_style: Style;
  rebalancing_interval: number;
  method: Method;
  scenario_generator: ScenarioGenerator;
}

export interface GenerateStrategyPayload {
  index_details_id: string;
  hedge_config: HedgingControl;
  deal_config: DealDetail;
}

export interface GeneratedStrategies extends GenerateStrategyPayload {
  hedging_strategies: HedgingStrategy[];
}

export interface HedgingStrategy {
  hedging_id: string;
  last_trading_day: string;
  futures_code: string;
  delivery_month: string;
  instrument: string;
  bid: number;
  ask: number;
  quotes: string;
  contract_size: number;
  hedging_effectiveness_low: number;
  hedging_effectiveness_mean: number;
  hedging_effectiveness_high: number;
  volume: number;
  exchange: string;
  time_of_update: string;
  bid_ask?: string;
  effectiveness?: string;
}

export interface HedgingStrategyDetail {
  amount_commodity: number;
  correlation: number;
  currency: string;
  delivery_month: string;
  description: string;
  exchange_code: string;
  futures_code: string;
  he_avg: number;
  he_low: number;
  he_up: number;
  hedge_ratio: number;
  last_tradable_date: string;
  nb_contracts: number;
  open_interest: number;
  px_ask: number;
  px_bid: number;
  px_high: number;
  px_last: number;
  px_low: number;
  px_open: number;
  settle_date: string;
  tenor: 0;
  the_size: string;
  unit: string;
  volume: number;
  contract_code: string;
}
