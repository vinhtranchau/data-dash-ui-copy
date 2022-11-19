import { TableActionType, TableColumn } from '../../../../ui-kit/table/table.model';

export const favoriteIndexesTableColumns: TableColumn[] = [
  {
    name: 'star',
    content: 'id',
    title: 'Remove Favorite',
    width: 80,
    action: TableActionType.Star,
  },
  {
    name: 'stable_index_code',
    content: 'stable_index_code',
    title: 'SIC',
    action: TableActionType.RouterLink,
    routerLink: 'id',
    width: 100,
  },
  { name: 'index_provider_code', content: 'index_provider_code', title: 'IPC', width: 100 },
  { name: 'index_provider', content: 'index_provider', title: 'Index Provider', width: 100 },
  { name: 'product', content: 'product', title: 'Product', width: 120 },
  { name: 'specification', content: 'specification', title: 'Specification', pipe: 'truncate', width: 180 },
  { name: 'delivery_point', content: 'delivery_point', title: 'Delivery Point', pipe: 'truncate', width: 180 },
  {
    name: 'automatic_live_pricing_check',
    content: 'automatic_live_pricing_check',
    title: 'Automatic Live Pricing Check',
    pipe: 'boolean',
    width: 100,
  },
  { name: 'cfp_ready', content: 'cfp_ready', title: 'CFP Ready', pipe: 'boolean', width: 80 },
  {
    name: 'index_price_end_date',
    content: 'index_price_end_date',
    title: 'Last Price Date',
    pipe: 'date',
    width: 120,
  },
  {
    name: 'last_index_price_units',
    content: 'last_index_price_units',
    title: 'Last Available Price',
    width: 200,
  },
  {
    name: 'last_price_movement',
    content: 'last_price_movement',
    title: 'Last Price Movement',
    width: 200,
  }
];

export const favoriteIndexesStickyColumns = ['stable_index_code', 'star'];
