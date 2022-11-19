import { Index } from './index.model';
import { User } from './user.model';

export enum AlertType {
  ALERT_TYPE_HISTORICAL_PRICE_CORRECTION = 'historical_price_correction',
  ALERT_TYPE_ABNORMAL_PRICE_MOVEMENT = 'abnormal_price_movement',
  ALERT_TYPE_MISSING_PRICE_UPDATE = 'missing_price_update',
  ALERT_TYPE_INDEX_DETAILS_CHANGED = 'index_details_changed',
  ALERT_TYPE_NEW_INDEX_ONBOARDED = 'new_index_onboarded',
  ALERT_TYPE_SCRAPE_MATCHING_CHANGED = 'scrape_matching_changed',
  ALERT_TYPE_SCRAPE_MATCHING_DELETED = 'scrape_matching_deleted',
}

export const AlertExplanation: { [alertType in AlertType]: string } = {
  [AlertType.ALERT_TYPE_HISTORICAL_PRICE_CORRECTION]:
    'This alert is triggered when any historical price is updated/changed by the index provider.',
  [AlertType.ALERT_TYPE_ABNORMAL_PRICE_MOVEMENT]:
    'This alert is triggered when the latest price update has a percentage change greater than 5 times the standard deviation of log returns.',
  [AlertType.ALERT_TYPE_MISSING_PRICE_UPDATE]:
    'This alert is triggered when an index has not had a price update in a long time (based on price update frequency).',
  [AlertType.ALERT_TYPE_INDEX_DETAILS_CHANGED]:
    'This alert is triggered when any index specifications are changed by the Data Intelligence team.',
  [AlertType.ALERT_TYPE_NEW_INDEX_ONBOARDED]: 'This alert is triggered when a new index is onboarded.',
  [AlertType.ALERT_TYPE_SCRAPE_MATCHING_CHANGED]:
    'This alert is triggered when the Data Intelligence team changes the scrape matched to the index, which is indicatative that the index provider changed their description or specifications of the index.',
  [AlertType.ALERT_TYPE_SCRAPE_MATCHING_DELETED]:
    'This alert is triggered when the Data Intelligence team deletes the scrape matched to the index, normally due to being matched wrongly. The price history of the index may have changed drastically from this action.',
};

export interface Alert {
  id: string;
  log_type: AlertType;
  index_details_id: Index;
  triggered_by: User | null;
  created_at: string;
}

export interface HistoricalPriceCorrection {
  stable_assigned_date: string;
  price_old: number;
  price: number;
}

export interface AbnormalPriceMovement {
  stable_assigned_date: string;
  price: number;
  price_change: number;
  price_change_percentage: number;
  standard_deviation: number;
}

export interface MissingPriceUpdate {
  last_price_update_date: string;
}

export interface IndexDetailsChanged {
  new_data: any;
  old_data: any;
}

export interface NewIndexOnboarded {
  // TODO: Just null at the moment
}

export interface ScrapeMatchingDeleted {
  // TODO: Just null at the moment
}

export interface ScrapeMatchingChanged {
  previous_scrape_id: string;
  added_scrape_id: string;
}

export interface AlertDetail extends Alert {
  extra_data:
    | HistoricalPriceCorrection
    | AbnormalPriceMovement
    | MissingPriceUpdate
    | IndexDetailsChanged
    | NewIndexOnboarded
    | ScrapeMatchingDeleted
    | ScrapeMatchingChanged;
}

export interface AlertGrouped {
  [date: string]: Alert[];
}

export enum AlertSubscriptionObjects {
  IndexDetails = 'indexes_database-indexdetails',
  ProductHierarchy = 'indexes_database-producthierarchy',
}

export interface AlertSubscription {
  alert_types: AlertType[];
  object_model?: string;
  object_ids?: string[];
}
