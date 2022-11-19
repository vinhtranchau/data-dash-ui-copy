import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const currencyTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'code', content: 'code', title: 'Code', width: 150 },
  { name: 'name', content: 'name', title: 'Name', width: 150 },
];
