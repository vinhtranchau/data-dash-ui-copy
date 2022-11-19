export enum PageType {
  DS = 'data_science',
  UW = 'under_writer',
  Client = 'client',
}

export interface Permission {
  type: PageType;
}
