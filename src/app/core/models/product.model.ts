import { ClassHierarchy } from './hierarchy.model';

export interface Product {
  id: string;
  name: string;
  class_hierarchy_id: ClassHierarchy;
  indexes_count?: number;
}
