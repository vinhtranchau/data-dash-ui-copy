export interface IndividualFeature {
  title: string;
  description: string;
}

export interface ChangeLogItems {
  version: string;
  title: string;
  date: string;
  features?: IndividualFeature[];
  bugs?: IndividualFeature[];
}
