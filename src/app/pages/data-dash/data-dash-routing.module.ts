import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { dataDashRoute } from '../../core/routes/data-dash.route';
import { PermissionLevel, PermissionType, Platform } from '../../core/models/permission.model';

import { RoleGuard } from '../../core/guards/role.guard';
import { AuthGuard } from '../../core/guards/auth.guard';

import { DashboardLayoutComponent } from '../../layout/dashboard-layout/dashboard-layout.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: dataDashRoute.home,
        component: LandingPageComponent,
      },
      {
        path: dataDashRoute.indexes,
        loadChildren: () => import('./index-library/indexes.module').then((m) => m.DDIndexesModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.IndexLibrary, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: dataDashRoute.indexAlerts,
        loadChildren: () => import('./alert-triggers/alert-triggers.module').then((m) => m.AlertTriggersModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.IndexAlerts, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: dataDashRoute.tradingCenter,
        loadChildren: () => import('./trading-center/trading-center.module').then((m) => m.TradingCenterModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.TradingCenter, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: dataDashRoute.portfolioSummary,
        loadChildren: () => import('./quant-portfolio/quant-portfolio.module').then((m) => m.QuantPortfolioModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.PortfolioSummary, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: dataDashRoute.derivativesTrading,
        loadChildren: () =>
          import('./derivatives-trading/derivatives-trading.module').then((m) => m.DerivativesTradingModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.DerivativesTrading, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: dataDashRoute.hedgingHome,
        loadChildren: () => import('./hedging-home/hedging-home.module').then((m) => m.HedgingHomeModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.HedgingHome, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: dataDashRoute.dsPricingRequestReview,
        loadChildren: () =>
          import('./pricing-request-review/pricing-request-review.module').then((m) => m.PricingRequestReviewModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.DataCenterAccess, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: dataDashRoute.uwPricingRequestReview,
        loadChildren: () =>
          import('./pricing-request-review/pricing-request-review.module').then((m) => m.PricingRequestReviewModule),
        canActivate: [RoleGuard],
        data: { type: PermissionType.UnderWriterAccess, level: PermissionLevel.View, platform: Platform.DataDash },
      },
      {
        path: `${dataDashRoute.quoteReview}/:id`,
        loadChildren: () =>
          import('./pricing-request-review/price-analysis/price-analysis.module').then((m) => m.PriceAnalysisModule),
        canActivate: [RoleGuard],
        data: {
          type: PermissionType.TradingCenter,
          level: PermissionLevel.Edit,
          platform: Platform.DataDash,
        },
      },
      {
        path: dataDashRoute.rollingDealConfiguration,
        loadChildren: () =>
          import('./rolling-deal-configuration/rolling-deal-configuration.module').then(
            (m) => m.RollingDealConfigurationModule
          ),
        canActivate: [RoleGuard],
        data: {
          type: PermissionType.RollingDealConfiguration,
          level: PermissionLevel.View,
          platform: Platform.DataDash,
        },
      },
      { path: '**', redirectTo: dataDashRoute.home },
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: { type: PermissionType.DataDashAccess, platform: Platform.DataDash },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataDashRoutingModule {}
