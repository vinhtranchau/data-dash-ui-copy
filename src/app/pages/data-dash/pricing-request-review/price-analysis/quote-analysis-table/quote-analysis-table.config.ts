import { TableActionType, TableColumn } from '../../../../../ui-kit/table/table.model';

const editColumn: TableColumn = { name: 'edit', content: '', title: 'Edit', action: TableActionType.Edit, width: 80 };
const primaryColumns: TableColumn[] = [
  { name: 'type', content: 'type', title: 'TYPE', width: 150 },
  { name: 'strike_ratio', content: 'strike_ratio', title: 'STRIKE RATIO', pipe: 'percent', width: 80 },
  { name: 'limit_ratio', content: 'limit_ratio', title: 'LIMIT RATIO', pipe: 'percent', width: 80 },
];
const algoColumn: TableColumn = {
  name: 'algo_premium_ratio',
  content: 'algo_premium_ratio',
  title: 'ALGO PREMIUM RATIO',
  pipe: 'percent',
  width: 80,
};
const secondaryColumns: TableColumn[] = [
  { name: 'final_premium', content: 'final_premium', title: 'FINAL PREMIUM', pipe: 'percent', width: 80 },
  { name: 'rol', content: 'rol', title: 'ROL', pipe: 'percent', width: 80 },
  { name: 'requested_volume', content: 'requested_volume', title: 'REQUESTED VOLUME', width: 80 },
];
const dateColumns: TableColumn[] = [
  { name: 'valid_from', content: 'valid_from', title: 'VALID FROM', pipe: 'date' },
  { name: 'valid_to', content: 'valid_to', title: 'VALID TO', pipe: 'date' },
];

export const dsQuoteAnalysisTableColumns: TableColumn[] = [
  editColumn,
  ...primaryColumns,
  algoColumn,
  {
    name: 'ds_premium_adjustment',
    content: 'ds_premium_adjustment',
    title: 'DS PREMIUM SURCHARGE',
    pipe: 'percent',
    width: 80,
  },
  ...secondaryColumns,
  ...dateColumns,
];

export const uwQuoteAnalysisTableColumns: TableColumn[] = [
  editColumn,
  ...primaryColumns,
  algoColumn,
  {
    name: 'uw_premium_surcharge',
    content: 'uw_premium_surcharge',
    title: 'UW PREMIUM SURCHARGE',
    pipe: 'percent',
    width: 80,
  },
  {
    name: 'commercial_discount',
    content: 'commercial_discount',
    title: 'COMMERCIAL DISCOUNT',
    pipe: 'percent',
    width: 80,
  },
  ...secondaryColumns,
  { name: 'executable_volume', content: 'executable_volume', title: 'EXECUTABLE VOLUME', width: 80 },
  ...dateColumns,
];

export const clientQuoteAnalysisTableColumn: TableColumn[] = [
  ...primaryColumns,
  ...secondaryColumns,
  { name: 'executable_volume', content: 'executable_volume', title: 'EXECUTABLE VOLUME', width: 80 },
  ...dateColumns,
];

export const fixationTableColumns: TableColumn[] = [
  { name: 'strike_price', content: 'strike_ratio', title: 'STRIKE PRICE', width: 100, pipe: 'number' },
  { name: 'limit_price', content: 'limit_ratio', title: 'LIMIT PRICE', width: 100, pipe: 'number' },
  { name: 'fixation_date', content: 'fixation_date', title: 'TRADE DATE', width: 100 },
  { name: 'coverage_start_in', content: 'coverage_start_in', title: 'COVERAGE START', width: 100 },
  { name: 'coverage_end_in', content: 'coverage_end_in', title: 'COVERAGE END', width: 100 },
  { name: 'desired_quantity', content: 'desired_quantity', title: 'QUANTITY', width: 100 },
  { name: 'premium', content: 'premium', title: 'PREMIUM', width: 100 },
  { name: 'claims_paid', content: 'claims_paid', title: 'CLAIMS', width: 100 },
];
