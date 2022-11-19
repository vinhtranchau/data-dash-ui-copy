import { UserDetails } from './auth.model';
import { IndexUUID } from './index.model';

export interface ScrapeDetails {
  id: string;
  description: string;
}

export interface ScrapeMatching {
  id: string;
  index_details_id: IndexUUID;
  scrape_details_id: ScrapeDetails;
  created_by: UserDetails;
  effective_date: Date | null;
  chain_index: number;
}

export interface ScrapeMatchingUploadFormat {
  SIC: string;
  'Scrape ID': string;
}

export interface ManualScrapeIdUpload {
  index_details_id: string;
  scrape_id: string;
  body: ManualScrapeData[];
  force: boolean;
}

export interface ManualScrapeData {
  published_date: number;
  report_start_date: number;
  report_end_date: number;
  stable_assigned_date: number;
  price: number;
}
