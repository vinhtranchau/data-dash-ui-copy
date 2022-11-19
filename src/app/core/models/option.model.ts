export interface Option {
  label: string;
  id: string | boolean | number | null;
}

export interface OptionValue {
  label: string;
  value: any;
}

export enum FieldType {
  String = 'string',
  Enum = 'enum',
  Boolean = 'boolean',
  Number = 'number',
}

export const booleanOptions: Option[] = [
  {
    label: '',
    id: null,
  },
  {
    label: 'Yes',
    id: true,
  },
  {
    label: 'No',
    id: false,
  },
];
