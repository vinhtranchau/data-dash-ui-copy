import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const indexTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', width: 50, action: TableActionType.Edit, editOnly: true },
  { name: 'download', content: 'id', title: 'Price Data', width: 50, action: TableActionType.Download, editOnly: true },
  { name: 'sync', content: 'id', title: 'Sync', width: 50, action: TableActionType.Sync, editOnly: true },
  {
    name: 'stable_index_code',
    content: 'stable_index_code',
    title: 'SIC',
    action: TableActionType.RouterLink,
    routerLink: 'id',
    width: 80,
  },
  { name: 'index_provider_code', content: 'index_provider_code', title: 'IPC', width: 100, pipe: 'truncate' },
  { name: 'product', content: 'product', title: 'Product', width: 120 },
  { name: 'class', content: 'class', title: 'Class', width: 120 },
  { name: 'group', content: 'group', title: 'Group', width: 130 },
  { name: 'kingdom', content: 'kingdom', title: 'Kingdom', width: 100 },
  { name: 'specification', content: 'specification', title: 'Specification', pipe: 'truncate', width: 180 },
  {
    name: 'specification_notes',
    content: 'specification_notes',
    title: 'Specification Notes',
    pipe: 'truncate',
    width: 180,
  },
  { name: 'delivery_point', content: 'delivery_point', title: 'Delivery Point', pipe: 'truncate', width: 180 },
  { name: 'unit_multiplier', content: 'unit_multiplier', title: 'Unit Multiplier', width: 80 },
  { name: 'unit', content: 'unit', title: 'Unit', width: 80 },
  { name: 'nation', content: 'nation', title: 'Nation', width: 80 },
  { name: 'currency', content: 'currency', title: 'Currency', width: 80 },
  { name: 'is_currency_cents', content: 'is_currency_cents', title: 'Is Currency Cents', pipe: 'boolean', width: 100 },
  { name: 'index_provider', content: 'index_provider', title: 'Index Provider', pipe: 'truncate', width: 180 },
  {
    name: 'index_provider_methodology',
    content: 'index_provider_methodology',
    title: 'Index Provider Methodology',
    link: true,
    width: 100,
  },
  {
    name: 'price_update_type',
    content: 'price_update_type',
    title: 'Price Update Type',
    pipe: 'text-transform',
    width: 90,
  },
  { name: 'price_update_url', content: 'price_update_url', title: 'Price Update URL', link: true, width: 90 },
  {
    name: 'source_publication_notes',
    content: 'source_publication_notes',
    title: 'Source Publication Notes',
    pipe: 'truncate',
    width: 90,
  },
  { name: 'trusted_access', content: 'trusted_access', title: 'Trusted Access', width: 90 },
  { name: 'public_access', content: 'public_access', title: 'Public Access', width: 90 },
  { name: 'price_frequency', content: 'price_frequency', title: 'Price Frequency', pipe: 'text-transform', width: 90 },
  {
    name: 'publishing_delay_min_multiplier',
    content: 'publishing_delay_min_multiplier',
    title: 'Publishing Delay Min',
    width: 100,
  },
  {
    name: 'publishing_delay_max_multiplier',
    content: 'publishing_delay_max_multiplier',
    title: 'Publishing Delay Max',
    width: 100,
  },
  {
    name: 'publishing_delay_units',
    content: 'publishing_delay_units',
    title: 'Publishing Delay Units',
    pipe: 'text-transform',
    width: 100,
  },
  { name: 'proxy_type', content: 'proxy_type', title: 'Proxy Type', pipe: 'text-transform', width: 100 },
  { name: 'proxy_index_id_name', content: 'proxy_index_id_name', title: 'Proxy Indexes', width: 100, list: true },
  { name: 'proxy_factor', content: 'proxy_factor', title: 'Proxy Factor', pipe: 'truncate', width: 130 },
  { name: 'proxy_notes', content: 'proxy_notes', title: 'Proxy Notes', pipe: 'truncate', width: 130 },
  { name: 'index_calculation', content: 'index_calculation', title: 'Index Calculation', pipe: 'truncate', width: 130 },
  {
    name: 'business_day_convention',
    content: 'business_day_convention',
    title: 'Business Day Convention',
    pipe: 'truncate',
    width: 130,
  },
  {
    name: 'bundle_display_formula',
    content: 'bundle_display_formula',
    title: 'Bundle Formula',
    pipe: 'truncate',
    width: 180,
  },
  { name: 'index_state', content: 'index_state', title: 'Index State', pipe: 'text-transform', width: 100 },
  { name: 'index_type', content: 'index_type', title: 'Index Type', pipe: 'text-transform', width: 120 },
  { name: 'tier', content: 'tier', title: 'Tier', pipe: 'text-transform', width: 80 },
  {
    name: 'underwriter_approval',
    content: 'underwriter_approval',
    title: 'Underwriter Approval',
    pipe: 'text-transform',
    width: 90,
  },
  { name: 'stable_grading_methodology', content: 'stable_grading_methodology', title: 'Methodology', width: 100 },
  {
    name: 'stable_grading_data_integrity',
    content: 'stable_grading_data_integrity',
    title: 'Data Integrity',
    width: 100,
  },
  {
    name: 'stable_grading_data_availability',
    content: 'stable_grading_data_availability',
    title: 'Data Availability',
    width: 100,
  },
  {
    name: 'stable_grading_index_robustness',
    content: 'stable_grading_index_robustness',
    title: 'Index Robustness',
    width: 100,
  },
  { name: 'stable_grading_total_grade', content: 'stable_grading_total_grade', title: 'Total Grade', width: 100 },
  { name: 'index_notes', content: 'index_notes', title: 'Index Notes', pipe: 'truncate', width: 100 },
  {
    name: 'automatic_live_pricing_check',
    content: 'automatic_live_pricing_check',
    title: 'Automatic Live Pricing Check',
    pipe: 'boolean',
    width: 100,
  },
  { name: 'cfp_ready', content: 'cfp_ready', title: 'CFP Ready', pipe: 'boolean', width: 80 },
  { name: 'in_hedging_book', content: 'in_hedging_book', title: 'Hedging Book', pipe: 'boolean', width: 80 },
  { name: 'is_rolling_deal', content: 'is_rolling_deal', title: 'Rolling Deal', pipe: 'boolean', width: 80 },
  {
    name: 'total_data_quality_check',
    content: 'total_data_quality_check',
    title: 'DS Check',
    pipe: 'text-transform',
    width: 100,
  },
  { name: 'red_list', content: 'red_list', title: 'Red List', pipe: 'text-transform', width: 100 },
  { name: 'last_updated_at', content: 'last_updated_at', title: 'Last Updated Date', pipe: 'date', width: 120 },
  { name: 'last_updated_by_name', content: 'last_updated_by_name', title: 'Last Updated By', width: 100 },
  { name: 'created_at', content: 'created_at', title: 'Onboard Date', pipe: 'date', width: 120 },
  { name: 'created_by_name', content: 'created_by_name', title: 'Onboard By', width: 100 },
];

export const indexTableStickyColumns = ['stable_index_code', 'edit', 'download', 'sync'];
