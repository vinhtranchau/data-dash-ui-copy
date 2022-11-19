import { Fixation } from './trading-center.model';

export interface QuoteAnalysis {
  algo_premium_ratio: number;
  commercial_discount: number;
  ds_premium_adjustment: number;
  executable_volume: number;
  final_premium: number;
  limit_ratio: number;
  rol: number;
  strike_ratio: number;
  type: string;
  uw_premium_surcharge: number;
  valid_from: string;
  valid_to: string;
  fixations: Fixation[];
}

export interface QuotePublishingCheck {
  is_sales_check_passed: boolean;
  is_underwriter_check_passed: boolean;
  is_ds_check_passed: boolean;
}

export interface QuoteAnalysisCustom {
  algo_premium_ratio: number;
  ds_premium_adjustment: number;
  commercial_discount: number;
  uw_premium_surcharge: number;
  executable_volume: number;
  valid_from: string;
  valid_to: string;
}

export interface UpdateRollingDealRequest extends QuotePublishingCheck, QuoteAnalysisCustom {}
