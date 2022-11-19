export interface FutureGroup {
  name: string; // Future product code
  list: Future[];
}

export interface Future {
  futures_code: string; // Futures product code
  description: string; // Futures product name
  delivery_month: string; // Futures delivery month
  px_last: number; // Latest price
  contract_code: string; // Specific futures contract (with specific maturity)
  delta: number; // Price change compared with the previous day,to be displayed in percents
}

export interface Candle {
  settle_date: string;
  px_open: number;
  px_high: number;
  px_low: number;
  px_bid: number;
  px_ask: number;
  px_last: number;
  volume: number;
}

export interface Curve extends Candle {
  delivery_month: string;
  description: string;
  fut_code: string;
  last_tradable_date: string;
  open_interest: number;
}

export interface Plot {
  candle: Candle[];
  curve: Curve[];
}

export enum HistoryType {
  OrderBook = 'order_book',
  TradeHistory = 'trade_history',
}

export enum Side {
  Buy = 'buy',
  Sell = 'sell',
}

export interface History {
  date: string;
  instrument: string;
  type: HistoryType;
  side: Side;
  price: number;
  amount: number;
  filled: number;
  total: string;
  status: string;
  pnl: string;
  exchange: string;
}

export interface OrderBookInfo {
  margin: number;
  available_usd: number;
  pnl: number;
}

export interface OrderBookTradePlot {
  ask_price: number[];
  ask_size: number[];
  bid_price: number[];
  bid_size: number[];
  level: number[];
}

export enum SgEng {
  Backtest = 'Backtest',
  HS = 'HS',
  fHS = 'fHS',
  fHSB = 'fHSB',
}

export interface Forecast {
  date: string;
  lower_bound: number;
  mean: number;
  upper_bound: number;
}
