export interface Hierarchy {
  id: string;
  name: string;
}

export interface KingdomHierarchy extends Hierarchy {}

export interface GroupHierarchy extends Hierarchy {
  kingdom_hierarchy_id: KingdomHierarchy;
}

export interface ClassHierarchy extends Hierarchy {
  group_hierarchy_id: GroupHierarchy;
  icon?: string;
  image?: string;
}

export interface ProductHierarchy extends Hierarchy {
  class_hierarchy_id: ClassHierarchy;
  hierarchy_chain?: string; // For rendering only
}

export enum HierarchyType {
  Product = 'product',
  Class = 'class',
  Group = 'group',
  Kingdom = 'kingdom',
}

export interface PostHierarchy {
  id?: string;
  hierarchy: HierarchyType;
  name: string;
  parent?: string;
}

export interface HierarchyTableData {
  id?: string;
  name?: string;
  parent?: string;
  parent_id?: string;

  product?: string;
  class?: string;
  group?: string;
  kingdom?: string;
}

export interface HierarchyDialogData {
  hierarchyType: HierarchyType;
  hierarchyData: HierarchyTableData | null;
  parent: HierarchyType | null;
}

export interface HierarchySunburstChart {
  names: string[];
  labels: string[];
  parents: string[];
  counts: number[];
  colors: number[];
}
