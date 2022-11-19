import { Index } from './index.model';

export interface RollingDealConfiguration {
  maximum_delay: number;
  minimum_volume: number;
  maximum_volume: number;
  maximum_duration: number;
  minimum_fixations: number;
  minimum_spread_ratio: number;
  maximum_spread_ratio: number;
  minimum_coverage_length: number;
  maximum_contract_length: number;
  maximum_put_strike_ratio: number;
  minimum_call_strike_ratio: number;
  minimum_risk_capital_per_deal: number;
  maximum_risk_capital_per_deal: number;
  maximum_risk_capital_per_index: number;
  last_available_expiration_length: number;
}

export interface RollingDealConfigurationData extends RollingDealConfiguration {
  id: string;
  is_exists: boolean;
  index: Index;
}
