import { Pipe, PipeTransform } from '@angular/core';
import { FavoriteIndexes, Index, IndexFlattened } from '../../core/models/index.model';
import { ClientIndex } from '../../core/models/trading-center.model';
import { getCurrencyAndUnit } from '../../core/utils/index-detail.util';

@Pipe({
  name: 'currencyAndUnit',
})
export class CurrencyAndUnitPipe implements PipeTransform {
  transform(index: IndexFlattened | ClientIndex | FavoriteIndexes | Index, includeCode = true): string {
    return getCurrencyAndUnit(index, includeCode);
  }
}
