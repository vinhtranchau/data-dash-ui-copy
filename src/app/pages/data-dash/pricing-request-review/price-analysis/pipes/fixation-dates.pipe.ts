import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Fixation } from '../../../../../core/models/trading-center.model';

@Pipe({
  name: 'fixationDates',
})
export class FixationDatesPipe implements PipeTransform {

  constructor(private readonly datePipe: DatePipe) {
  }

  transform(fixations: Fixation[]): string[] {
    return fixations.map(x => this.datePipe.transform(x.fixation_date, 'MMM YY') || '');
  }

}
