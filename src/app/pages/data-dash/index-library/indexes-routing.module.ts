import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DDIndexSearchComponent } from './index-search/index-search.component';
import { DDIndexesComponent } from './indexes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DDIndexesComponent },
      { path: 'search', component: DDIndexSearchComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DDIndexesRoutingModule {
}
