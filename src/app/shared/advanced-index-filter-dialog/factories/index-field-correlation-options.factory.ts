// TODO: Define index fields in programmatic way
import { InjectionToken } from '@angular/core';

import { FieldType } from '../../../core/models/option.model';

export const INDEX_FIELD_CORRELATION_OPTIONS = new InjectionToken('INDEX_FIELD_CORRELATION_OPTIONS_FACTORY', {
  factory: () => [
    {
      label: 'Correlation',
      id: 'original_currency_correlation',
      type: FieldType.Number,
    },
    {
      label: '3Y Correlation',
      id: 'original_currency_3y_correlation',
      type: FieldType.Number,
    },
    {
      label: 'Log Correlation',
      id: 'original_currency_correlation_log_diff',
      type: FieldType.Number,
    },
    {
      label: '3Y Log Correlation',
      id: 'original_currency_3y_correlation_log_diff',
      type: FieldType.Number,
    },
    {
      label: 'Num Data Points',
      id: 'num_data_points_overlap',
      type: FieldType.Number,
    },
  ],
});
