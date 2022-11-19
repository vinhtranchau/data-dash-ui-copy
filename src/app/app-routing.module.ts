import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { dataCenterRoute } from './core/routes/data-center.route';
import { dataDashRoute } from './core/routes/data-dash.route';
import { standaloneModalRoute, standaloneModalRouteOutlet } from './core/routes/standalone-modal.route';
import { userRoute } from './core/routes/user.route';
import { absolutePath } from './core/utils/route.util';

const routes: Routes = [
  {
    path: dataDashRoute.root,
    loadChildren: () => import('./pages/data-dash/data-dash.module').then((m) => m.DataDashModule),
  },
  {
    path: dataCenterRoute.root,
    loadChildren: () => import('./pages/data-center/data-center.module').then((m) => m.DataCenterModule),
  },
  {
    path: userRoute.root,
    loadChildren: () => import('./pages/user/user.module').then((m) => m.UserModule),
  },
  // Sometimes, standalone modals should be run in the primary outlet. (ex: full screen modal for the dialogs)
  {
    path: standaloneModalRoute.root,
    loadChildren: () => import('./standalone-modals/standalone-modals.module').then((m) => m.StandaloneModalsModule),
  },
  {
    path: standaloneModalRoute.root,
    outlet: standaloneModalRouteOutlet,
    loadChildren: () => import('./standalone-modals/standalone-modals.module').then((m) => m.StandaloneModalsModule),
  },
  { path: '', redirectTo: absolutePath([dataDashRoute.root, dataDashRoute.home]), pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
