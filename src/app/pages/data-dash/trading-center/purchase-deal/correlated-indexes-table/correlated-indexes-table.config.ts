import { TableActionType, TableColumn } from '../../../../../ui-kit/table/table.model';
import { TradingIndexCorrelationPair } from '../../../../../core/models/trading-center.model';

export const CorrelatedIndexesTableColumns: TableColumn[] = [
  {
    name: 'stable_index_code',
    content: 'stable_index_code',
    title: 'SIC',
    action: TableActionType.RouterLink,
    routerLink: 'correlated_index_id',
    width: 80,
  },
  { name: 'product', content: 'product', title: 'Product', width: 100 },
  { name: 'index_provider', content: 'index_provider', title: 'Index Provider', width: 100 },
];

export interface TradeIndexCorrelationPairExtended extends TradingIndexCorrelationPair {
  stable_index_code: string;
  product: string;
  index_provider: string;
  correlated_index_id: string;
}
