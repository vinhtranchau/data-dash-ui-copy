import { TemplateRef } from '@angular/core';

import { Pipes } from '../pipe/pipes';

export interface TableColumn {
  name: string;
  content: string;
  title: string;
  pipe?: Pipes;
  truncateLimit?: number; // Only when truncate filter is applied.
  link?: boolean;
  template?: TemplateRef<any>; // Accept template for the column
  action?: TableActionType;
  list?: boolean;
  width?: number;
  routerLink?: any;
  editOnly?: boolean;
  default?: string;
}

export type ComparisonOperator = '===' | '>' | '>=' | '<' | '<=' | null;

export interface FormatCondition {
  comparisonColumn: string;
  comparisonOperator: ComparisonOperator;
  // This value will be placed at the second place (right place) of the comparison statement.
  rightComparisonValue: any;
  // When value is null then apply to entire row, or it can be just column name.
  applyTo: string | null;
  // Accept custom defined classes (global - caring encapsulation) or tailwind css classes can be used.
  formatClasses: string;
}

export interface LoadDataEvent {
  pageSize: number;
  pageIndex: number;
  keyword?: string;
}

export enum TableActionType {
  RouterLink = 'router_link',
  Edit = 'edit',
  Download = 'download',
  Delete = 'delete',
  ContentPaste = 'content_paste',
  Compare = 'compare_arrows',
  Star = 'star',
  Sync = 'sync',
  Bolt = 'bolt',
}

export interface TableAction {
  id: string;
  action: TableActionType;
}
