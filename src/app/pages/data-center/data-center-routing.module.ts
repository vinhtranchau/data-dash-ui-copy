import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionLevel, PermissionType, Platform } from '../../core/models/permission.model';
import { RoleGuard } from '../../core/guards/role.guard';
import { AuthGuard } from '../../core/guards/auth.guard';
import { dataCenterRoute } from '../../core/routes/data-center.route';

import { DashboardLayoutComponent } from '../../layout/dashboard-layout/dashboard-layout.component';
import { DataCenterComponent } from './data-center.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: dataCenterRoute.indexes,
        loadChildren: () => import('./indexes/indexes.module').then((m) => m.IndexesModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.IndexDetailsTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.users,
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.UsersTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.permissions,
        loadChildren: () => import('./permissions/permissions.module').then((m) => m.PermissionsModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.GroupPermissionTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.scrapeMatching,
        loadChildren: () => import('./scrape-matching/scrape-matching.module').then((m) => m.ScrapeMatchingModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.ScrapeMatchingTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.hierarchy,
        loadChildren: () => import('./hierarchy/hierarchy.module').then((m) => m.HierarchyModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.HierarchyTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.unit,
        loadChildren: () => import('./units/units.module').then((m) => m.UnitsModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.UnitTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.currency,
        loadChildren: () => import('./currency/currency.module').then((m) => m.CurrencyModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.CurrencyTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.nation,
        loadChildren: () => import('./nation/nation.module').then((m) => m.NationModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.NationTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.indexProvider,
        loadChildren: () => import('./index-provider/index-provider.module').then((m) => m.IndexProviderModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.IndexProviderTable, level: PermissionLevel.View, platform: Platform.DataCenter },
      },
      {
        path: dataCenterRoute.indexExtension,
        loadChildren: () => import('./index-extension/index-extension.module').then((m) => m.IndexExtensionModule),
        canActivate: [RoleGuard],
        data: {
          type: PermissionType.IndexExtensionDataTable,
          level: PermissionLevel.View,
          platform: Platform.DataCenter,
        },
      },
      {
        path: dataCenterRoute.historicalData,
        loadChildren: () => import('./historical-data/historical-data.module').then((m) => m.HistoricalDataModule),
        canActivate: [RoleGuard],
        data: {
          type: PermissionType.HistoricalDataTable,
          level: PermissionLevel.View,
          platform: Platform.DataCenter,
        },
      },
      {
        path: dataCenterRoute.apiKey,
        loadChildren: () => import('./api-key/api-key.module').then((m) => m.ApiKeyModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.CanGenerateApiKey, platform: Platform.DataCenter },
      },
      { path: '**', component: DataCenterComponent },
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: { type: PermissionType.DataCenterAccess, platform: Platform.DataCenter },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataCenterRoutingModule {}
