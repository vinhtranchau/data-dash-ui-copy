import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const scrapeMatchingTableColumns: TableColumn[] = [
  { name: 'delete', content: 'id', title: 'Delete', width: 80, action: TableActionType.Delete, editOnly: true },
  {
    name: 'stable_index_code',
    content: 'stable_index_code',
    title: 'SIC',
    width: 80,
    action: TableActionType.RouterLink,
    routerLink: 'index_details_id__id',
  },
  {
    name: 'scrape_description',
    content: 'scrape_description',
    title: 'Scrape ID',
    pipe: 'truncate',
    truncateLimit: 100,
  },
  {
    name: 'copy',
    content: 'scrape_description',
    title: 'Copy Scrape ID',
    width: 80,
    action: TableActionType.ContentPaste,
  },
  { name: 'chain_index', content: 'chain_index', title: 'Chain Index', width: 80 },
  { name: 'created_by_name', content: 'created_by_name', title: 'Created By', width: 100 },
  { name: 'effective_date', content: 'effective_date', title: 'Effective Date', pipe: 'date', width: 120 },
];
