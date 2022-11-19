import { Pipe, PipeTransform } from '@angular/core';

import { FormatCondition, TableColumn } from '../table.model';

@Pipe({
  name: 'conditionalFormat',
})
export class ConditionalFormatPipe implements PipeTransform {
  transform(element: any, column: TableColumn, formatConditions: FormatCondition[]): string {
    const conditions = formatConditions.filter((condition) => condition.applyTo === column.name || !condition.applyTo);
    const classes = conditions.map((condition) => {
      const { comparisonColumn, rightComparisonValue, formatClasses } = condition;
      const leftComparisonValue = element[comparisonColumn];
      switch (condition.comparisonOperator) {
        case '===':
          return leftComparisonValue === rightComparisonValue ? formatClasses : '';
        case '<':
          return leftComparisonValue < rightComparisonValue ? formatClasses : '';
        case '<=':
          return leftComparisonValue <= rightComparisonValue ? formatClasses : '';
        case '>':
          return leftComparisonValue > rightComparisonValue ? formatClasses : '';
        case '>=':
          return leftComparisonValue >= rightComparisonValue ? formatClasses : '';
        case null:
          return formatClasses;
        default:
          return '';
      }
    });

    return classes.join(' ');
  }
}
