import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const rollingDealConfigurationTableColumns: TableColumn[] = [
  { name: 'edit', content: 'sic', title: 'Edit', width: 50, action: TableActionType.Edit, editOnly: true },
  {
    name: 'sic',
    content: 'sic',
    title: 'SIC',
    action: TableActionType.RouterLink,
    routerLink: 'id',
    width: 80,
  },
  { name: 'maximum_delay', content: 'maximum_delay', title: 'Max Delay', pipe: 'number' },
  { name: 'minimum_volume', content: 'minimum_volume', title: 'Min Volume', pipe: 'number' },
  { name: 'maximum_volume', content: 'maximum_volume', title: 'Max Volume', pipe: 'number' },
  { name: 'maximum_duration', content: 'maximum_duration', title: 'Max Duration', pipe: 'number' },
  { name: 'minimum_fixations', content: 'minimum_fixations', title: 'Min Fixations', pipe: 'number' },
  {
    name: 'minimum_spread_ratio',
    content: 'minimum_spread_ratio',
    title: 'Min Spread Ratio',
    pipe: 'percent',
  },
  {
    name: 'maximum_spread_ratio',
    content: 'maximum_spread_ratio',
    title: 'Max Spread Ratio',
    pipe: 'percent',
  },
  { name: 'minimum_coverage_length', content: 'minimum_coverage_length', title: 'Min Coverage Length', pipe: 'number' },
  { name: 'maximum_contract_length', content: 'maximum_contract_length', title: 'Max Coverage Length', pipe: 'number' },
  {
    name: 'maximum_put_strike_ratio',
    content: 'maximum_put_strike_ratio',
    title: 'Max Put Strike Ratio',
    pipe: 'percent',
  },
  {
    name: 'minimum_call_strike_ratio',
    content: 'minimum_call_strike_ratio',
    title: 'Min Call Strike Ratio',
    pipe: 'percent',
  },
  {
    name: 'minimum_risk_capital_per_deal',
    content: 'minimum_risk_capital_per_deal',
    title: 'Min Risk Capital per Deal',
    pipe: 'currency',
  },
  {
    name: 'maximum_risk_capital_per_deal',
    content: 'maximum_risk_capital_per_deal',
    title: 'Max Risk Capital per Deal',
    pipe: 'currency',
  },
  {
    name: 'maximum_risk_capital_per_index',
    content: 'maximum_risk_capital_per_index',
    title: 'Max Risk Capital per Index',
    pipe: 'currency',
  },
  {
    name: 'last_available_expiration_length',
    content: 'last_available_expiration_length',
    title: 'Last Available Expiration Length',
    pipe: 'number',
  },
];

export const indexTableStickyColumns = ['stable_index_code', 'edit', 'download', 'sync'];
