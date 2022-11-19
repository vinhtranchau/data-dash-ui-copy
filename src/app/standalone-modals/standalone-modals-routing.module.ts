import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionLevel, PermissionType, Platform } from '../core/models/permission.model';

import { standaloneModalRoute } from '../core/routes/standalone-modal.route';
import { RoleGuard } from '../core/guards/role.guard';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: standaloneModalRoute.indexDetails,
    loadChildren: () => import('./index-details/index-details.module').then((m) => m.IndexDetailsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { type: PermissionType.IndexLibrary, level: PermissionLevel.View, platform: Platform.DataDash },
  },
  {
    path: standaloneModalRoute.indexCorrelations,
    loadChildren: () => import('./index-correlation/index-correlation.module').then((m) => m.IndexCorrelationModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { type: PermissionType.IndexLibrary, level: PermissionLevel.View, platform: Platform.DataDash },
  },
  {
    path: standaloneModalRoute.rollingDealAction,
    loadChildren: () =>
      import('./rolling-deal-action/rolling-deal-action-routing.module').then((m) => m.RollingDealActionRoutingModule),
  },
  {
    path: '**',
    redirectTo: '/data-dash',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StandaloneModalsRoutingModule {}
