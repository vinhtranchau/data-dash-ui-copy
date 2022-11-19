import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const indexProviderTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'name', content: 'name', title: 'Name', width: 250, pipe: 'truncate', truncateLimit: 50 },
  { name: 'status', content: 'status', title: 'Status', width: 100, pipe: 'text-transform' },
  { name: 'public_access', content: 'public_access', title: 'Public Access', width: 100 },
  { name: 'trusted_access', content: 'trusted_access', title: 'Trusted Access', width: 100 },
];
