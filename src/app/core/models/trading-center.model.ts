import { Currency } from './currency.model';
import { OptionTypes } from './empirical-modelling.model';
import { IndexProvider, PriceFrequency } from './index.model';
import { Option } from './option.model';
import { Product } from './product.model';
import { Unit } from './unit.model';
import { RollingDealConfigurationData } from './rolling-deal-configuration.model';

export interface ClientIndex {
  id: string;
  currency_id: Currency;
  is_currency_cents: boolean;
  product_id: Product;
  specification: string;
  delivery_point: string;
  last_index_price: number;
  last_price_change: number;
  last_price_percentage_change: number;
  stable_index_code: string;
  unit_id: Unit;
  unit_multiplier: number;
  index_provider_id: IndexProvider;
  price_frequency: PriceFrequency;
  is_favorite: boolean;
  index_price_end_date: string;
  public_access_level: number;
  in_hedging_book: boolean;
  is_rolling_deal: boolean;
  last_index_price_units?: string;
  last_price_movement?: string;
  product?: string;
  index_provider?: string;
  rolling_deal_config: RollingDealConfigurationData;
  image?: string;
}

export enum StatusType {
  Purchase = 'purchase',
  Bid = 'bid',
  Watch = 'watch',
  Request = 'request',
  Cancelled = 'cancelled',
  Live = 'live',
  Settled = 'settled',
}

export enum TradeIndexType {
  All = 'all',
  RollingDeal = 'rolling_deal',
  HedgingBook = 'hedging_book',
  None = 'none',
}

export enum ContractType {
  Individual = 'individual',
  RollingDeal = 'rolling_deal',
}

export interface TradeRequest {
  claims_paid?: string;
  coverage_end_in: string;
  coverage_start_in: string;
  desired_quantity: number;
  direction: OptionTypes;
  id: string;
  index: ClientIndex;
  limit: string;
  strike: string;
  mark_to_market?: string;
  minimum_quantity: number;
  maximum_quantity: number;
  premium?: string;
  status: StatusType;
  style: string;
  purchase_watch_status_time: Date;
  stable_index_code?: string;
  product?: string;
  index_provider?: string;
  units_collated?: string;
  index_id?: string;
  total_premiums?: number;
  total_claims_paid?: number;
  bid?: bidRequest;
  bid_price?: number;
  bid_expiration_time?: Date;
  bid_filled_quantity?: number;
  bid_is_partial_execution_enabled?: boolean;
}

export interface bidRequest {
  is_partial_execution_enabled: boolean;
  expiration_time: Date;
  price: number;
  filled_quantity?: number;
}

export interface TradingIndexCorrelationPair {
  id: string;
  num_data_points_overlap: number;
  original_currency_correlation: number;
  original_currency_3y_correlation: number;
  original_currency_correlation_log_diff: number;
  original_currency_3y_correlation_log_diff: number;
  correlated_index: ClientIndex;
}

// TODO: add structure types
export enum RollingDealStructureTypes {
  PopularStructureOne = 1,
  PopularStructureTwo = 2,
}

export const rollingDealStructureTypesOptions: Option[] = [
  {
    label: 'Popular Structure 1',
    id: RollingDealStructureTypes.PopularStructureOne,
  },
  {
    label: 'Popular Structure 2',
    id: RollingDealStructureTypes.PopularStructureTwo,
  },
];

export interface rollingDealConfig {
  direction: OptionTypes;
  end_month_delta: number;
  start_month_delta: number;
  limit_ratio: number;
  strike_ratio: number;
  desired_quantity: number;
  fixation_month_delta: number;
}

export interface SubmitRollingDeal {
  trade_requests: rollingDealConfig[];
}

export interface Fixation {
  claims_paid: number;
  coverage_end_in: string;
  coverage_start_in: string;
  desired_quantity: number;
  fixation_date: string;
  id: string;
  limit_ratio: string;
  premium: number;
  strike_ratio: string;
}

export enum RollingDealStatus {
  IndicativeRequest = 'indicative_request',
  IndicativeReceived = 'indicative_received',
  IndicativeReprice = 'indicative_reprice',
  FirmRequest = 'firm_request',
  FirmReceived = 'firm_received',
  FirmReprice = 'firm_reprice',
  FirmAccepted = 'firm_accepted',
  PendingTradeExecution = 'pending_trade_execution',
  FirmExecuted = 'firm_executed',
  Live = 'live',
  Expired = 'expired',
}

export interface RollingDealPortfolio {
  id: string;
  index: ClientIndex;
  status: RollingDealStatus;
  quantity: number;
  direction: OptionTypes;
  limit_ratio: number;
  strike_ratio: number;
  selling_months: string[];
  quote_files: QuoteFile[];
  months_duration: number;
  starting_delay_month: number;
  fixations: Fixation[];
  is_indicative_deal: boolean;
  is_ds_check_passed: boolean;
  is_sales_check_passed: boolean;
  is_underwriter_check_passed: boolean;
  created_at: string;
  created_by: { name: string; company_name: string };
  // For the UI models...
  selling_months_string?: string;
}

export interface QuoteFile {
  url: string;
  file_name: string;
}
