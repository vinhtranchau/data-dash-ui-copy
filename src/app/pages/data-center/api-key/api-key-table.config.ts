import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const apiKeyTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'name', content: 'name', title: 'Name', width: 150 },
  { name: 'description', content: 'description', title: 'Description', width: 150, pipe: 'truncate' },
  { name: 'key', content: 'key', title: 'Api Key', action: TableActionType.ContentPaste, width: 100 },
  { name: 'created_at', content: 'created_at', title: 'Created At', width: 100, pipe: 'date' },
  { name: 'updated_at', content: 'updated_at', title: 'Updated At', width: 100, pipe: 'date' },
  { name: 'permission_count', content: 'permission_count', title: 'APIs Granted', width: 100 },
];
