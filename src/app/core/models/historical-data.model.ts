export interface HistoricalDataIndexes {
  index_details_id__stable_index_code: string;
  id: string;
  data_length: number;
  created_at: Date | null;
}

export interface ExcelHistoricalData {
  price: number;
  stable_assigned_date: number;
  published_date: number;
  report_start_date: number;
  report_end_date: number;
  scraped_at_date: number;
}

export interface HistoricalData {
  price: number;
  stable_assigned_date: Date;
  published_date: Date;
  report_start_date: Date;
  report_end_date: Date;
  scraped_at_date: Date;
}

export interface HistoricalDataPayload {
  index_details_id: string;
  spider: string;
  scrape_id: string;
  historical_data: HistoricalData[];
}
