import { ClassHierarchy } from './hierarchy.model';
import { Nation } from './nation.model';

export enum BusinessTypes {
  Other = 'other',
  Broker = 'broker',
  Trader = 'trader',
  Exchange = 'exchange',
  Producer = 'producer',
  Retailer = 'retailer',
  Processor = 'processor',
  Financial = 'financial',
  Individual = 'individual',
  FoodService = 'food_service',
  GovernmentEntity = 'government_entity',
  IndustryAssociation = 'industry_association',
  MarketResearchProvider = 'market_research_provider',
  PriceReportingAgency = 'price_reporting_agency',
  FinancialInstitution = 'financial_institution',
  ConsumerManufacturer = 'consumer_manufacturer',
}

export enum TurnOverTypes {
  Range0To10 = '0_10',
  Range11To50 = '11_50',
  Range51To200 = '51_200',
  Range201To500 = '201_500',
  Range501Plus = '>501',
}

export const turnOverOptions = [
  {
    label: '$10 Million or less',
    id: TurnOverTypes.Range0To10,
  },
  {
    label: '$11 Million to $50 Million',
    id: TurnOverTypes.Range11To50,
  },
  {
    label: '$51 Million to $200 Million',
    id: TurnOverTypes.Range51To200,
  },
  {
    label: '$201 Million to $500 Million',
    id: TurnOverTypes.Range201To500,
  },
  {
    label: '$501 Million or more',
    id: TurnOverTypes.Range501Plus,
  },
];

export interface Company {
  name: string;
  city: string;
  country: Nation;
  business_type: BusinessTypes;
  turnover: TurnOverTypes;
}

export interface CommodityInterest {
  klass_id?: string;
  is_buy?: boolean;
  is_sell?: boolean;
  klass?: ClassHierarchy;
  name?: string;
}
