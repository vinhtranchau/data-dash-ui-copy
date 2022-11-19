import { Permission } from './permission.model';

export interface LoginResponse {
  access: string;
  avatar: string;
  created_at: string;
  email: string;
  id: number;
  is_2fa_enabled: boolean;
  is_email_validated: boolean;
  is_trusted_user: boolean;
  is_onboarded_completely: boolean;
  has_sales_role: boolean;
  name: string;
  permissions: Permission;
  refresh: string;
  slack_id: string;
}

export interface Session {
  token: string;
  user_permissions: UserPermissions;
  user_details: UserDetails;
}

export interface UserDetails {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  is_2fa_enabled?: boolean;
  is_trusted_user?: boolean;
  is_onboarded_completely?: boolean;
  has_sales_role?: boolean;
}

export interface UserPermissions {
  permissions?: Permission;
}
