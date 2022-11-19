export interface ApiKey {
  id?: string;
  name?: string;
  description?: string;
  key?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: ApiKeyPermission[];
  permission_count?: number;
}

export interface ApiKeyPermission {
  title: string;
  description: string;
  method: string;
  action: string;
  is_detail: boolean;
  basename: string;
}
