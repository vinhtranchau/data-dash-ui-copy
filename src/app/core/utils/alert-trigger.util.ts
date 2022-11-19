import { Alert, AlertGrouped } from '../models/alert-trigger.model';

export function groupByDate<T>(source: Alert[], dateFieldName: string, existingSource: AlertGrouped): AlertGrouped {
  return source.reduce((target: any, item) => {
    const copy = item as any;
    const onlyDate = copy[dateFieldName].split('T')[0];
    if (target[onlyDate]) {
      target[onlyDate].push(item);
    } else {
      target[onlyDate] = [item];
    }
    return target;
  }, existingSource);
}
