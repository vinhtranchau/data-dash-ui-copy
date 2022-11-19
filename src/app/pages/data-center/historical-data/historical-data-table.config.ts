import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const historicalDataTableColumns: TableColumn[] = [
  {
    name: 'download',
    content: 'id',
    title: 'Historical Data',
    width: 80,
    action: TableActionType.Download,
    editOnly: true
  },
  { name: 'delete', content: 'id', title: 'Delete', width: 80, action: TableActionType.Delete, editOnly: true },
  {
    name: 'index_details_id__stable_index_code',
    content: 'index_details_id__stable_index_code',
    title: 'SIC',
    width: 100,
    action: TableActionType.RouterLink,
    routerLink: 'id',
  },
  { name: 'data_length', content: 'data_length', title: 'Data Points', width: 100 },
  { name: 'created_at', content: 'created_at', title: 'Created At', width: 120, pipe: 'date' },
];
