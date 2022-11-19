import { Option } from '../models/option.model';

export function enumToLabel(source: string, labels?: { [key: string]: string }) {
  if (labels) {
    return labels[source];
  }
  if (source === '') {
    return '';
  }
  const list = source.split('_');
  return list
    .map((item) => {
      const labelItem = item.toLowerCase();
      return labelItem[0].toUpperCase() + labelItem.slice(1);
    })
    .join(' ');
}

export function enumToOptions<T>(source: any, labels?: { [key: string]: string }): Option[] {
  return Object.keys(source).map((key) => ({ label: enumToLabel(source[key], labels), id: source[key] }));
}
