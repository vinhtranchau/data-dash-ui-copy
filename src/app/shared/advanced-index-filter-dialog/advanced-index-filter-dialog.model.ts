import { Observable } from 'rxjs';

import { Option } from '../../core/models/option.model';
import { enumToOptions } from '../../core/utils/enum.util';

export enum FieldType {
  String = 'string',
  Enum = 'enum',
  Boolean = 'boolean',
  Number = 'number',
}

export interface FieldOption extends Option {
  type: FieldType;
  options?: Option[];
  asyncOptions$?: Observable<Option[]>;
}

export enum AggregateMethod {
  MatchAll = 'match_all',
  MatchAny = 'match_any',
}

export const aggregateMethodOptions = enumToOptions(AggregateMethod);

export enum SearchBy {
  Contains = 'icontains',
  Exact = 'iexact',
  NotContains = 'not_icontains',
  NotExact = 'not_iexact',
  GreaterThan = 'gt',
  GreaterThanOrEqualTo = 'gte',
  LessThan = 'lt',
  LessThanOrEqualTo = 'lte',
}

export const searchByLabel = {
  icontains: 'Contains',
  iexact: 'Exact',
  not_icontains: 'Not Contains',
  not_iexact: 'Not Exact',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

export const searchByExactOptions = [
  { label: searchByLabel[SearchBy.Exact], id: SearchBy.Exact },
  { label: searchByLabel[SearchBy.NotExact], id: SearchBy.NotExact },
];

export const searchByNumberOptions = [
  { label: searchByLabel[SearchBy.GreaterThan], id: SearchBy.GreaterThan },
  { label: searchByLabel[SearchBy.GreaterThanOrEqualTo], id: SearchBy.GreaterThanOrEqualTo },
  { label: searchByLabel[SearchBy.LessThan], id: SearchBy.LessThan },
  { label: searchByLabel[SearchBy.LessThanOrEqualTo], id: SearchBy.LessThanOrEqualTo },
  { label: searchByLabel[SearchBy.Exact], id: SearchBy.Exact },
  { label: searchByLabel[SearchBy.NotExact], id: SearchBy.NotExact },
];
export const searchByOptions = [
  { label: searchByLabel[SearchBy.Contains], id: SearchBy.Contains },
  { label: searchByLabel[SearchBy.NotContains], id: SearchBy.NotContains },
  { label: searchByLabel[SearchBy.Exact], id: SearchBy.Exact },
  { label: searchByLabel[SearchBy.NotExact], id: SearchBy.NotExact },
];
