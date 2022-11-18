export enum PermissionLevel {
  NoAccess,
  View,
  Edit,
}

export interface Permission {
  id?: string;
  permissions_group?: string;

  group_permissions_table: PermissionLevel;
  users_table: PermissionLevel;
  index_provider_table: PermissionLevel;
  hierarchy_table: PermissionLevel;
  nation_table: PermissionLevel;
  currency_table: PermissionLevel;
  unit_table: PermissionLevel;
  index_details_table: PermissionLevel;
  index_extension_data_table: PermissionLevel;
  historical_data_table: PermissionLevel;
  scrape_matching_table: PermissionLevel;

  index_library: PermissionLevel;
  derivatives_trading: PermissionLevel;
  trading_center: PermissionLevel;
  index_alerts: PermissionLevel;
  hedging_home: PermissionLevel;
  portfolio_summary: PermissionLevel;
  under_writer_access: PermissionLevel;
  rolling_deal_configuration: PermissionLevel;

  can_generate_api_key: boolean;
  data_center_access: boolean;
  data_dash_access: boolean;
}
