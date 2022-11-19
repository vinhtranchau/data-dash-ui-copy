export interface QuantPortfolio {
  id: string;
  name: string;
  currency: string;
  price: number;
  price_change_percentage: number;
  price_change_text?: string;
}

export interface QuantPortfolioPrice {
  price_date: string;
  price: number;
}
