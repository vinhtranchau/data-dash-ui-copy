import { TableColumn } from '../../../../ui-kit/table/table.model';

export const historicalPayoffDataTable: TableColumn[] = [
  { name: 'config_number', content: 'config_number', title: 'Config Number', width: 80 },
  { name: 'dates', content: 'dates', title: 'Dates', width: 120 },
  { name: 'spot_price', content: 'spot_price', title: 'Spot Price', width: 100, pipe: 'number' },
  { name: 'policy_start', content: 'policy_start', title: 'Policy Start', width: 120 },
  { name: 'policy_end', content: 'policy_end', title: 'Policy End', width: 120 },
  { name: 'option_type', content: 'option_type', title: 'Option Type', width: 100, pipe: 'text-transform' },
  { name: 'strike_price', content: 'strike_price', title: 'Strike Price', width: 100, pipe: 'number' },
  { name: 'limit_price', content: 'limit_price', title: 'Limit Price', width: 100, pipe: 'number' },
  { name: 'moving_average', content: 'moving_average', title: 'Moving Average', width: 100, pipe: 'number' },
  { name: 'settlement_price', content: 'settlement_price', title: 'Settlement Price', width: 100, pipe: 'number' },
  { name: 'contract_size', content: 'contract_size', title: 'Contract Size', width: 80, pipe: 'number' },
  { name: 'net_position', content: 'net_position', title: 'Net Position', width: 100, pipe: 'number' },
  { name: 'pay_off', content: 'pay_off', title: 'Pay Off', width: 100, pipe: 'number' },
];

export const statsTableRowOne: TableColumn[] = ['1st %', '5th %', '25th %', '50th %', '75th %', '95th %', '99th %'].map(
  (item) => ({ name: item, content: item, title: item, width: 100, pipe: 'number' })
);

export const statsTableRowTwo: TableColumn[] = ['Mean', 'Std', 'Min', '% > 0', 'Max', 'Skewness', 'Kurtosis'].map(
  (item) => ({ name: item, content: item, title: item, width: 100, pipe: 'number' })
);
