import { FieldOption, FieldType } from './advanced-index-filter-dialog.model';

export function getField(fieldId: string, fieldOptions: FieldOption[]): FieldOption | undefined {
  return fieldOptions.find((option) => option.id === fieldId);
}

export function getFieldType(fieldId: string, fieldOptions: FieldOption[]): FieldType {
  const field = getField(fieldId, fieldOptions);
  return field ? field.type : FieldType.String;
}
