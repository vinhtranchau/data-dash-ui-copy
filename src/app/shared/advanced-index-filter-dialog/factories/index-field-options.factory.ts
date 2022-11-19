// TODO: Define index fields in programmatic way
import { inject, InjectionToken } from '@angular/core';
import { map } from 'rxjs';

import { FieldType } from '../../../core/models/option.model';
import {
  DSCheck,
  IndexState,
  IndexType,
  PriceFrequency,
  PriceUpdateType,
  ProxyType,
  PublishingDelayUnit,
  RedList,
  SeasonalityVerdict,
  seasonalityVerdictLabels,
  Tier,
  UnderwriterApproval,
} from '../../../core/models/index.model';
import { enumToOptions } from '../../../core/utils/enum.util';
import { StoreService } from '../../../core/services/store.service';

export const INDEX_FIELD_OPTIONS = new InjectionToken('INDEX_FIELD_OPTIONS_FACTORY', {
  factory: () => [
    {
      label: 'Stable Index Code',
      id: 'id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).indexUUIDs$.pipe(
        map((uuids) => uuids.map((item) => ({ id: item.id, label: item.stable_index_code })))
      ),
    },
    {
      label: 'Index Provider Code',
      id: 'index_provider_code',
      type: FieldType.String,
    },
    {
      label: 'Product',
      id: 'product_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).hierarchies$.pipe(
        map((res) => res.map((item) => ({ id: item.id, label: item.name })))
      ),
    },
    {
      label: 'Class',
      id: 'product_id__class_hierarchy_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).classes$.pipe(
        map((res) => res.map((item) => ({ id: item.id, label: item.name })))
      ),
    },
    {
      label: 'Group',
      id: 'product_id__class_hierarchy_id__group_hierarchy_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).groups$.pipe(
        map((res) => res.map((item) => ({ id: item.id, label: item.name })))
      ),
    },
    {
      label: 'Kingdom',
      id: 'product_id__class_hierarchy_id__group_hierarchy_id__kingdom_hierarchy_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).kingdoms$.pipe(
        map((res) => res.map((item) => ({ id: item.id, label: item.name })))
      ),
    },
    {
      label: 'Specification',
      id: 'specification',
      type: FieldType.String,
    },
    {
      label: 'Specification Notes',
      id: 'specification_notes',
      type: FieldType.String,
    },
    {
      label: 'Delivery Point',
      id: 'delivery_point',
      type: FieldType.String,
    },
    {
      label: 'Unit Multiplier',
      id: 'unit_multiplier',
      type: FieldType.Number,
    },
    {
      label: 'Unit',
      id: 'unit_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).units$.pipe(
        map((res) => res.map((unit) => ({ id: unit.id, label: unit.units })))
      ),
    },
    {
      label: 'Nation',
      id: 'nation_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).nations$.pipe(
        map((res) => res.map((nation) => ({ id: nation.id, label: nation.code })))
      ),
    },
    {
      label: 'Currency',
      id: 'currency_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).currencies$.pipe(
        map((res) => res.map((currency) => ({ id: currency.id, label: currency.code })))
      ),
    },
    {
      label: 'Is Currency Cents',
      id: 'is_currency_cents',
      type: FieldType.Boolean,
    },
    {
      label: 'Index Provider',
      id: 'index_provider_id__id',
      type: FieldType.Enum,
      asyncOptions$: inject(StoreService).indexProviders$.pipe(
        map((res) =>
          res.map((index_provider) => ({
            id: index_provider.id,
            label: index_provider.name,
          }))
        )
      ),
    },
    {
      label: 'Index Provider Methodology',
      id: 'index_provider_methodology',
      type: FieldType.String,
    },
    {
      label: 'Price Update Type',
      id: 'price_update_type',
      type: FieldType.Enum,
      options: enumToOptions(PriceUpdateType),
    },
    {
      label: 'Price Update URL',
      id: 'price_update_url',
      type: FieldType.String,
    },
    {
      label: 'Source Publication Notes',
      id: 'source_publication_notes',
      type: FieldType.String,
    },
    {
      label: 'Trusted Access',
      id: 'trusted_access',
      type: FieldType.Number,
    },
    {
      label: 'Public Access',
      id: 'public_access',
      type: FieldType.Number,
    },
    {
      label: 'Price Frequency',
      id: 'price_frequency',
      type: FieldType.Enum,
      options: enumToOptions(PriceFrequency),
    },
    {
      label: 'Publishing Delay Min',
      id: 'publishing_delay_min_multiplier',
      type: FieldType.Number,
    },
    {
      label: 'Publishing Delay Max',
      id: 'publishing_delay_max_multiplier',
      type: FieldType.Number,
    },
    {
      label: 'Publishing Delay Units',
      id: 'publishing_delay_units',
      type: FieldType.Enum,
      options: enumToOptions(PublishingDelayUnit),
    },
    {
      label: 'Proxy Type',
      id: 'proxy_type',
      type: FieldType.Enum,
      options: enumToOptions(ProxyType),
    },
    {
      label: 'Proxy Factor',
      id: 'proxy_factor',
      type: FieldType.String,
    },
    {
      label: 'Proxy Notes',
      id: 'proxy_notes',
      type: FieldType.String,
    },
    {
      label: 'Index Calculation',
      id: 'index_calculation',
      type: FieldType.String,
    },
    {
      label: 'Business Day Convention',
      id: 'business_day_convention',
      type: FieldType.String,
    },
    {
      label: 'Bundle Formula',
      id: 'bundle_display_formula',
      type: FieldType.String,
    },
    {
      label: 'Index State',
      id: 'index_state',
      type: FieldType.Enum,
      options: enumToOptions(IndexState),
    },
    {
      label: 'Index Type',
      id: 'index_type',
      type: FieldType.Enum,
      options: enumToOptions(IndexType),
    },
    {
      label: 'Tier',
      id: 'tier',
      type: FieldType.Enum,
      options: enumToOptions(Tier),
    },
    {
      label: 'Underwriter Approval',
      id: 'underwriter_approval',
      type: FieldType.Enum,
      options: enumToOptions(UnderwriterApproval),
    },
    {
      label: 'Methodology',
      id: 'stable_grading_methodology',
      type: FieldType.Number,
    },
    {
      label: 'Data Integrity',
      id: 'stable_grading_data_integrity',
      type: FieldType.Number,
    },
    {
      label: 'Data Availability',
      id: 'stable_grading_data_availability',
      type: FieldType.Number,
    },
    {
      label: 'Index Robustness',
      id: 'stable_grading_index_robustness',
      type: FieldType.Number,
    },
    {
      label: 'Total Grade',
      id: 'stable_grading_total_grade',
      type: FieldType.Number,
    },
    {
      label: 'Index Notes',
      id: 'index_notes',
      type: FieldType.String,
    },
    {
      label: 'Automatic Live Pricing Check',
      id: 'automatic_live_pricing_check',
      type: FieldType.Boolean,
    },
    {
      label: 'CFP Ready',
      id: 'cfp_ready',
      type: FieldType.Boolean,
    },
    {
      label: 'Hedging Book',
      id: 'in_hedging_book',
      type: FieldType.Boolean,
    },
    {
      label: 'Rolling Deal',
      id: 'is_rolling_deal',
      type: FieldType.Boolean,
    },
    {
      label: 'DS Check',
      id: 'total_data_quality_check',
      type: FieldType.Enum,
      options: enumToOptions(DSCheck),
    },
    {
      label: 'Red List',
      id: 'red_list',
      type: FieldType.Enum,
      options: enumToOptions(RedList),
    },
    {
      label: 'Seasonality Verdict',
      id: 'seasonality_verdict',
      type: FieldType.Enum,
      options: enumToOptions(SeasonalityVerdict, seasonalityVerdictLabels),
    },
  ],
});
