import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const rollingDealsTableColumns: TableColumn[] = [
  // {
  //   name: 'action',
  //   content: 'id',
  //   title: 'Action',
  //   width: 80,
  //   action: TableActionType.Bolt,
  // },
  {
    name: 'stable_index_code',
    content: 'stable_index_code',
    title: 'SIC',
    action: TableActionType.RouterLink,
    routerLink: 'index_id',
    width: 100,
  },
  { name: 'index_provider', content: 'index_provider', title: 'Index Provider', width: 100 },
  { name: 'product', content: 'product', title: 'Product', width: 120 },
  { name: 'units', content: 'units_collated', title: 'Units', width: 100 },
  { name: 'direction', content: 'direction', title: 'Direction', width: 80, pipe: 'text-transform' },
  { name: 'quantity', content: 'quantity', title: 'Quantity', width: 80, pipe: 'number' },
  { name: 'strike_ratio', content: 'strike_ratio', title: 'Strike Ratio', width: 100, pipe: 'number' },
  { name: 'limit_ratio', content: 'limit_ratio', title: 'Limit Ratio', width: 100, pipe: 'number' },
  { name: 'starting_delay_month', content: 'starting_delay_month', title: 'Starting Delay Months', width: 50 },
  { name: 'months_duration', content: 'months_duration', title: 'Duration Months', width: 50 },
  { name: 'status', content: 'status', title: 'Status', width: 150, pipe: 'text-transform' },
];

export const StickyColumns = ['action', 'stable_index_code'];

export const fixationTableColumns: TableColumn[] = [
  { name: 'strike_price', content: 'strike_ratio', title: 'Strike Price', width: 100 },
  { name: 'limit_price', content: 'limit_ratio', title: 'Limit Price', width: 100 },
  { name: 'fixation_date', content: 'fixation_date', title: 'Trade Date', width: 100 },
  { name: 'coverage_start_in', content: 'coverage_start_in', title: 'Coverage Start', width: 100 },
  { name: 'coverage_end_in', content: 'coverage_end_in', title: 'Coverage Eng', width: 100 },
  { name: 'desired_quantity', content: 'desired_quantity', title: 'Quantity', width: 100 },
  { name: 'premium', content: 'premium', title: 'Premium', width: 100 },
  { name: 'claims_paid', content: 'claims_paid', title: 'Claims', width: 100 },
];
