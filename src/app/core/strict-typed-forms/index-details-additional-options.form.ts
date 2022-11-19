import { FormControl } from '@angular/forms';

export interface AdditionalOptions {
  '12m_ma'?: boolean;
  '24m_ma'?: boolean;
  trend?: boolean;
  extension?: boolean;
  seasonality?: boolean;
  sarima?: boolean;
  historical_vol?: boolean;
  horizontal_lines?: any;
  secondary_index?: any;
  historical_pdf?: boolean;
}

export interface AdditionalOptionsForm {
  '12m_ma': FormControl<boolean>;
  '24m_ma': FormControl<boolean>;
  trend: FormControl<boolean>;
  extension: FormControl<boolean>;
  seasonality: FormControl<boolean>;
  sarima: FormControl<boolean>;
  historical_vol: FormControl<boolean>;
  horizontal_lines: FormControl<any>;
  secondary_index: FormControl<any>;
  historical_pdf: FormControl<boolean>;
}

export const additionalOptionsFormGroup = {
  '12m_ma': [false],
  '24m_ma': [false],
  trend: [false],
  extension: [false],
  seasonality: [false],
  sarima: [false],
  historical_vol: [false],
  horizontal_lines: [null],
  secondary_index: [null],
  historical_pdf: [false],
};
