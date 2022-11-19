import { TableColumn } from '../../../ui-kit/table/table.model';

export const pricingRequestReviewTableColumns: TableColumn[] = [
  { name: 'id', content: 'id', title: 'Request ID', width: 150 },
  { name: 'sic', content: 'sic', title: 'SIC', width: 150 },
  { name: 'name', content: 'name', title: 'Name', width: 150 },
  { name: 'company_name', content: 'company_name', title: 'Company Name', width: 150 },
  { name: 'specification', content: 'specification', title: 'Description' },
  {
    name: 'created_at',
    content: 'created_at',
    title: 'Requested Date',
    pipe: 'date',
    width: 100,
  },
  { name: 'statusText', content: 'statusText', title: 'Status', width: 100 },
];
