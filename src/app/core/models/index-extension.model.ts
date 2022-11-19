export interface ExtendedIndexes {
  index_details_id__stable_index_code: string;
  id: string;
  data_length: number;
  created_at: Date | null;
}

export interface ExcelIndexExtension {
  price: number;
  date: number;
}

export interface IndexExtension {
  price: number;
  date: Date;
}

export interface IndexExtensionPayload {
  index_details_id: string;
  extension_data: IndexExtension[];
}
