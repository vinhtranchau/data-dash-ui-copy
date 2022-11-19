import { BundleFormulaFormGroup, FavoriteIndexes, Index, IndexFlattened, IndexUUID } from '../models/index.model';
import { ClientIndex } from '../models/trading-center.model';
import { getDecimal } from './number.util';

export function getBundleFormulaExpression(
  formulas: BundleFormulaFormGroup[],
  indexUUIDs?: IndexUUID[]
): { formulaDict: any; formulaExpression: string } {
  const formulaDict: any = {};
  const validFormulas = formulas.filter((formula) => formula.bundle_coefficient && formula.bundle_stable_index_code);

  // NOTE: Same key should be merged into one when calculating
  validFormulas.forEach((formula) => {
    const { bundle_coefficient, bundle_stable_index_code } = formula;
    formulaDict[bundle_stable_index_code] = (formulaDict[bundle_stable_index_code] || 0) + bundle_coefficient;
  });

  if (indexUUIDs) {
    const formulaExpression = Object.keys(formulaDict)
      .map((id) => {
        const found = indexUUIDs.find((item) => item.id === id);
        return `${getDecimal(formulaDict[id], 5)} * ${found ? found.stable_index_code : ''}`;
      })
      .join(' + ')
      .replaceAll('+ -', '- ');

    return { formulaDict, formulaExpression };
  } else {
    return { formulaDict, formulaExpression: '' };
  }
}

export function parseIndexDetails(index: Index): IndexFlattened {
  return {
    ...index,
    product: index.product_id.name,
    class: index.product_id.class_hierarchy_id.name,
    group: index.product_id.class_hierarchy_id.group_hierarchy_id.name,
    kingdom: index.product_id.class_hierarchy_id.group_hierarchy_id.kingdom_hierarchy_id.name,
    nation: index.nation_id.code,
    currency: index.currency_id.code,
    unit: index.unit_id.units,
    index_provider: index.index_provider_id.name,
    proxy_index_id_name: index.proxy_index_id.map((obj) => obj.stable_index_code),
  };
}

export function getCurrencyAndUnit(
  indexDetails: IndexFlattened | ClientIndex | FavoriteIndexes | Index,
  includeCode = true
) {
  if (indexDetails) {
    return (
      (includeCode ? indexDetails.stable_index_code + ' ' : '') +
      indexDetails.currency_id.code +
      (indexDetails.is_currency_cents ? ' (Cents) / ' : ' / ') +
      (indexDetails.unit_multiplier !== 1 ? indexDetails.unit_multiplier + ' ' : '') +
      indexDetails.unit_id.units
    );
  }
  return '';
}
