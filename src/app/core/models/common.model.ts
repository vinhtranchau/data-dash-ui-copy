export interface HttpResponse<T> {
  status: string;
  data: T;
}

export interface HttpSuccessResponse {
  data: string; // 'success'
  status: string; // 'success'
}

export interface PaginationResponse<T> {
  results: T[];
  total: number;
}

export interface PaginationResponseV2<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface XlsUploadResult<T> {
  [sheetName: string]: T[];
}
