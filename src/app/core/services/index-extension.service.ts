import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

import { HttpSuccessResponse } from '../models/common.model';
import { environment } from '../../../environments/environment';
import { ExtendedIndexes, IndexExtensionPayload } from '../models/index-extension.model';

@Injectable({
  providedIn: 'root',
})
export class IndexExtensionService {
  constructor(private http: HttpClient) {}

  getExtendedIndexes(): Observable<ExtendedIndexes[]> {
    const url = `${environment.api}/extended_indexes/`;
    return this.http.get<ExtendedIndexes[]>(url).pipe(
      map((res) => {
        return res.map((item) => ({
          ...item,
          created_at: item.created_at ? new Date(item.created_at) : null,
        }));
      })
    );
  }

  postIndexExtension(payload: IndexExtensionPayload): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/indexes/${payload.index_details_id}/update_index_extension/`;
    return this.http.post<HttpSuccessResponse>(url, { extension_data: payload.extension_data });
  }

  downloadIndexExtension(id: string, name: string | null): any {
    const url = `${environment.api}/indexes/${id}/download_index_extension/`;
    const file_name = name || `${id}.csv`;
    return this.http.post<string>(url, null).pipe(
      map((res) => new Blob([res], { type: 'text/csv' })),
      map((blob) => {
        saveAs(blob, file_name);
      })
    );
  }
}
