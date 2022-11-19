import {
  ClassHierarchy,
  GroupHierarchy,
  HierarchyTableData,
  HierarchyType,
  KingdomHierarchy,
  ProductHierarchy,
} from '../models/hierarchy.model';
import {
  allHierarchyTableColumns,
  classTableColumns,
  groupTableColumns,
  kingdomTableColumns,
  productTableColumns,
} from '../../pages/data-center/hierarchy/hierarchy-table.config';
import { TableColumn } from '../../ui-kit/table/table.model';

export function getHierarchyTableColumns(type?: HierarchyType): { columns: TableColumn[]; parent?: HierarchyType } {
  switch (type) {
    case HierarchyType.Product:
      return {
        columns: productTableColumns,
        parent: HierarchyType.Class,
      };
    case HierarchyType.Class:
      return {
        columns: classTableColumns,
        parent: HierarchyType.Group,
      };
    case HierarchyType.Group:
      return {
        columns: groupTableColumns,
        parent: HierarchyType.Kingdom,
      };
    case HierarchyType.Kingdom:
      return {
        columns: kingdomTableColumns,
      };
    default:
      return { columns: allHierarchyTableColumns };
  }
}

export function parseHierarchies(hierarchies: any[], type?: HierarchyType): HierarchyTableData[] {
  switch (type) {
    case HierarchyType.Product:
      return hierarchies.map((hierarchy: ProductHierarchy) => ({
        ...hierarchy,
        parent: hierarchy?.class_hierarchy_id?.name,
        parent_id: hierarchy?.class_hierarchy_id?.id,
      }));
    case HierarchyType.Class:
      return hierarchies.map((hierarchy: ClassHierarchy) => ({
        ...hierarchy,
        parent: hierarchy?.group_hierarchy_id?.name,
        parent_id: hierarchy?.group_hierarchy_id?.id,
      }));
    case HierarchyType.Group:
      return hierarchies.map((hierarchy: GroupHierarchy) => ({
        ...hierarchy,
        parent: hierarchy?.kingdom_hierarchy_id?.name,
        parent_id: hierarchy?.kingdom_hierarchy_id?.id,
      }));
    case HierarchyType.Kingdom:
      return hierarchies.map((hierarchy: KingdomHierarchy) => ({
        ...hierarchy,
        parent: 'placeholder', // Enforce random placeholder string
        parent_id: 'placeholder', // Enforce random placeholder string
      }));
    default:
      return hierarchies.map((hierarchy: ProductHierarchy) => ({
        product: hierarchy.name,
        class: hierarchy?.class_hierarchy_id?.name,
        group: hierarchy?.class_hierarchy_id?.group_hierarchy_id?.name,
        kingdom: hierarchy?.class_hierarchy_id?.group_hierarchy_id?.kingdom_hierarchy_id?.name,
      }));
  }
}
