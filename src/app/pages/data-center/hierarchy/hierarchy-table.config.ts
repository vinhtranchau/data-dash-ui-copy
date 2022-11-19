import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const productTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'name', content: 'name', title: 'Product', width: 200 },
  { name: 'parent', content: 'parent', title: 'Class', width: 200 },
];

export const classTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'name', content: 'name', title: 'Class', width: 200 },
  { name: 'parent', content: 'parent', title: 'Group', width: 200 },
];

export const groupTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'name', content: 'name', title: 'Group', width: 200 },
  { name: 'parent', content: 'parent', title: 'Kingdom', width: 200 },
];

export const kingdomTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, width: 80, editOnly: true },
  { name: 'name', content: 'name', title: 'Kingdom', width: 200 },
];

export const allHierarchyTableColumns: TableColumn[] = [
  { name: 'product', content: 'product', title: 'Product', width: 150 },
  { name: 'class', content: 'class', title: 'Class', width: 150 },
  { name: 'group', content: 'group', title: 'Group', width: 150 },
  { name: 'kingdom', content: 'kingdom', title: 'Kingdom', width: 150 },
];
