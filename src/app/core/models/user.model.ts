import { Permission } from './permission.model';

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: Permission;
  is_trusted_user: boolean;
  is_active: boolean;
  created_at: Date | null;
  is_email_validated: boolean;
  is_onboarded_completely: boolean;
  slack_id: string;
  avatar?: string;
  permissions_name?: string; // Rendering property
}

export interface EditUserPayload {
  id: string;
  permission_id: string;
  is_active: boolean;
  is_trusted_user: boolean;
  is_email_validated: boolean;
  slack_id: string;
}
