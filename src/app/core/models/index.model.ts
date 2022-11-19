import { Product } from './product.model';
import { Nation } from './nation.model';
import { Currency } from './currency.model';
import { Unit } from './unit.model';
import { UserDetails } from './auth.model';
import { Option } from './option.model';

export interface IndexProvider {
  id: string;
  name: string;
  status: string;
  public_access: number;
  trusted_access: number;
}

export interface IndexUUID {
  id: string;
  stable_index_code: string;
}

export interface IndexProductUUID {
  id: string;
  stable_index_code: string;
  product_id: Product;
  stable_index_code__product?: string;
}

export enum Tier {
  Tier1 = 'tier_1',
  Tier2 = 'tier_2',
  Tier3 = 'tier_3',
  Fail = 'fail',
  Pending = 'pending',
}

export enum UnderwriterApproval {
  Approved = 'approved',
  Pending = 'pending',
  Denied = 'denied',
}

export enum IndexState {
  Active = 'active',
  Validated = 'validated',
  Unvalidated = 'unvalidated',
  Inactive = 'inactive',
  Archived = 'archived',
  ComingSoon = 'coming_soon',
}

export enum IndexType {
  StableContract = 'stable_contract',
  Futures = 'futures',
  Statistical = 'statistical',
  NonSettlement = 'non-settlement', // NOTE: non-settlement is just string, no underscore case
}

export enum PublishingDelayUnit {
  Null = '',
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
}

export enum PriceFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  TwoPerWeek = 'two_per_week',
  EveryTwoWeeks = 'every_two_weeks',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
}

export enum ProxyType {
  Null = '',
  Index = 'index',
  Factor = 'factor',
  Future = 'future',
}

export enum PriceUpdateType {
  Website = 'website',
  Bloomberg = 'bbg',
  Email = 'email',
  API = 'api',
  SFTP = 'sftp',
  Manual = 'manual',
}

export const priceUpdateTypeLabels = {
  website: 'Website',
  bbg: 'Bloomberg',
  email: 'Email',
  api: 'API',
  sftp: 'SFTP',
  manual: 'Manual',
};

export enum IndexProviderStatus {
  Live = 'live',
  Idle = 'idle',
  Archived = 'archived',
}

export enum DSCheck {
  Pass = 'pass',
  Fail = 'fail',
  Pending = 'pending',
}

export enum RedList {
  Green = 'green',
  Orange = 'orange',
  Red = 'red',
}

export enum AccessData {
  Level1 = 1,
  Level2,
  Level3,
  Level4,
  Level5,
  Level6,
}

export enum SeasonalityVerdict {
  S = 'S',
  NS = 'NS',
  FPR = 'FPR',
  NEE = 'NEE',
}

export enum PeriodPopularIndex {
  AllTime = 'all',
  OneWeek = '1w',
  ThreeMonth = '3m',
  SixMonth = '6m',
}

export const seasonalityVerdictLabels = {
  S: 'Seasonal',
  NS: 'Non-Seasonal',
  FPR: 'SIC does not pass preliminary requirements',
  NEE: 'Not enough evidence for seasonality',
};

export const accessDataOptions: Option[] = [
  {
    label: '',
    id: null,
  },
  {
    label: 'Level 1 - All historical data shown on interactive chart; data is downloadable.',
    id: AccessData.Level1,
  },
  {
    label: 'Level 2 - All historical data shown on interactive chart; data is NOT downloadable.',
    id: AccessData.Level2,
  },
  {
    label: 'Level 3 - 5 years of historical data shown on interactive chart; data is NOT downloadable.',
    id: AccessData.Level3,
  },
  {
    label: 'Level 4 - 2 years of historical data shown on interactive chart; data is NOT downloadable.',
    id: AccessData.Level4,
  },
  {
    label: 'Level 5 - 2 years of data dispayed in static chart; data is NOT downloadable.',
    id: AccessData.Level5,
  },
  {
    label: 'Level 6 - No data shown to client; no data downloadable.',
    id: AccessData.Level6,
  },
];

export interface IndexSummary {
  id: string;
  stable_index_code: string;
  product_id: Product;
  index_provider_id: IndexProvider;
  product?: string;
  specification: string;
  delivery_point: string;
  index_provider?: string;
  index_provider_status?: IndexProviderStatus;
  tier: Tier;
  underwriter_approval: UnderwriterApproval;
  red_list: RedList;
  total_data_quality_check: string;
  total_data_quality_check_fail_reason: string;
  index_state: IndexState;
  index_type: IndexType;
  cfp_ready: boolean | null;
  in_hedging_book: boolean | null;
  is_rolling_deal: boolean | null;
  icon?: string | null;
  image?: string | null;
  is_favorite: boolean;
}

export interface Index extends IndexSummary {
  nation_id: Nation;
  currency_id: Currency;
  unit_id: Unit;
  created_by: UserDetails;
  last_updated_by: UserDetails;
  index_provider_code: string;
  public_access: AccessData | null;
  trusted_access: AccessData | null;
  specification_notes: string;
  is_currency_cents: boolean;
  unit_multiplier: number;
  index_provider_methodology: string;
  price_update_type: PriceUpdateType | null;
  price_update_url: string;
  index_calculation: string;
  bundle_hierarchy: number;
  bundle_formula: { [key: string]: number };
  bundle_display_formula: string;
  index_price_start_date: string;
  index_price_end_date: string;
  last_index_price: number;
  last_price_change: number;
  last_price_percentage_change: number;
  proxy_type: ProxyType;
  proxy_factor: string;
  proxy_notes: string;
  price_frequency: PriceFrequency;
  source_publication_notes: string;
  publishing_delay_min_multiplier: number;
  publishing_delay_max_multiplier: number;
  publishing_delay_units: PublishingDelayUnit;
  stable_grading_methodology: number;
  stable_grading_data_integrity: number;
  stable_grading_data_availability: number;
  stable_grading_index_robustness: number;
  stable_grading_total_grade: number;
  created_at: Date | null;
  last_updated_at: Date | null;
  index_notes: string;
  seasonality_verdict: SeasonalityVerdict;
  sarima_model: string;
  num_data_points: number;
  num_missing_data_points: number;
  num_data_points_since_2009: number;
  num_missing_data_points_since_2009: number;
  consecutive_missing_data_check: boolean;
  minimum_length_data_check: boolean;
  standard_length_data_check: boolean;
  proxy_index_id: IndexUUID[];
  business_day_convention: string;
  automatic_live_pricing_check: boolean;
}

export interface FavoriteIndexes extends Index {
  last_price_movement: string;
  last_index_price_units: string;
}

export interface IndexFlattened extends Index {
  product: string;
  class: string;
  group: string;
  kingdom: string;
  nation: string;
  currency: string;
  unit: string;
  index_provider: string;
  proxy_index_id_name: string[];
}

export interface BundleFormulaFormGroup {
  bundle_coefficient: number;
  bundle_stable_index_code: string;
}

export interface IndexPrice {
  index_details_id?: string;
  stable_assigned_date: string;
  scraped_at_date?: string;
  published_date?: string;
  report_start_date?: string;
  report_end_date?: string;
  combined_at_date?: string;
  is_extension_price?: boolean;
  price: number;
}

export interface IndexSort {
  field: string;
  order_by: 'asc' | 'desc' | '';
}

export interface IndexId {
  index_detail_id: string;
}

export interface IndexPopular {
  index_details: string;
  stable_index_code: string;
  popular: number;
  favorite_by: FavoriteBy[];
}

export interface FavoriteBy {
  log_by: string;
  name: string;
  favorite: number;
}

export interface IndexFavoriteIds {
  index_detail_id: string[];
  status: boolean;
}
