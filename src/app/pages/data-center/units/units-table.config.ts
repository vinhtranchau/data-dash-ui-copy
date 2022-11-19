import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const unitTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'units', content: 'units', title: 'Units', width: 150 },
  { name: 'units_plural', content: 'units_plural', title: 'Units Plural', width: 150 },
  { name: 'abbreviations', content: 'abbreviations', title: 'Abbreviations', width: 150 },
];
