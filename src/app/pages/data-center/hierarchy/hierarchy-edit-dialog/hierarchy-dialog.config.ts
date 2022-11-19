import { HierarchyType } from '../../../../core/models/hierarchy.model';

export interface HierarchyTableData {
  id: string;
  name: string;
  parent: string;
  parent_id: string;
}

export interface HierarchyDialogData {
  hierarchyType: HierarchyType;
  hierarchyData: HierarchyTableData | null;
  parent: HierarchyType | null;
}
