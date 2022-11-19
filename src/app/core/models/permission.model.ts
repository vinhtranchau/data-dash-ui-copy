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

export enum PermissionType {
  PermissionGroup = 'permission_group',
  GroupPermissionTable = 'group_permissions_table',
  UsersTable = 'users_table',
  IndexProviderTable = 'index_provider_table',
  HierarchyTable = 'hierarchy_table',
  NationTable = 'nation_table',
  CurrencyTable = 'currency_table',
  UnitTable = 'unit_table',
  IndexDetailsTable = 'index_details_table',
  IndexExtensionDataTable = 'index_extension_data_table',
  HistoricalDataTable = 'historical_data_table',
  ScrapeMatchingTable = 'scrape_matching_table',
  CanGenerateApiKey = 'can_generate_api_key',
  DataCenterAccess = 'data_center_access',
  DataDashAccess = 'data_dash_access',
  IndexLibrary = 'index_library',
  DerivativesTrading = 'derivatives_trading',
  TradingCenter = 'trading_center',
  IndexAlerts = 'index_alerts',
  HedgingHome = 'hedging_home',
  PortfolioSummary = 'portfolio_summary',
  UnderWriterAccess = 'under_writer_access',
  RollingDealConfiguration = 'rolling_deal_configuration'
}

export enum PermissionLevel {
  NoAccess,
  View,
  Edit,
}

export const PermissionLevelOptions = [
  { label: 'None', id: PermissionLevel.NoAccess },
  { label: 'View', id: PermissionLevel.View },
  { label: 'Edit', id: PermissionLevel.Edit },
];

export enum Platform {
  DataCenter = 'data-center',
  DataDash = 'data-dash',
}

export interface PermissionGuardInfo {
  type: PermissionType;
  level?: PermissionLevel;
  platform?: Platform;
}

export const generalAccessPermissionTypes = [
  PermissionType.DataCenterAccess,
  PermissionType.DataDashAccess,
  PermissionType.CanGenerateApiKey,
];
