import { TableActionType, TableColumn } from '../../../ui-kit/table/table.model';

export const userTableColumns: TableColumn[] = [
  { name: 'edit', content: 'id', title: 'Edit', action: TableActionType.Edit, editOnly: true, width: 50 },
  {
    name: 'avatar',
    content: 'avatar',
    title: 'Avatar',
    pipe: 'image',
    default: 'assets/images/default-avatar.jpeg',
    width: 100
  },
  { name: 'name', content: 'name', title: 'Name', width: 150 },
  { name: 'email', content: 'email', title: 'Email', width: 150 },
  { name: 'is_trusted_user', content: 'is_trusted_user', title: 'Trusted User', width: 100 },
  {
    name: 'permissions_name',
    content: 'permissions_name',
    title: 'Permissions Group',
    pipe: 'text-transform',
    width: 100
  },
  { name: 'is_active', content: 'is_active', title: 'Allowed Access', width: 100 },
  { name: 'is_onboarded_completely', content: 'is_onboarded_completely', title: 'Onboarded Completely', width: 100 },
  { name: 'created_at', content: 'created_at', title: 'Created At', pipe: 'date', width: 120 },
  { name: 'is_email_validated', content: 'is_email_validated', title: 'Validated Email', width: 100 },
  { name: 'slack_id', content: 'slack_id', title: 'Slack ID', width: 100 },
];
