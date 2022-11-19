import { Injectable } from "@angular/core";
import { IndexSummary } from "src/app/core/models/index.model";

@Injectable({
  providedIn: 'root',
})
export class IndexSearchService {
  indexes: IndexSummary[] = [];
}
