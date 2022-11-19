import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScrapeMatchingComponent } from './scrape-matching.component';

const routes: Routes = [{ path: '', component: ScrapeMatchingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScrapeMatchingRoutingModule {
}
