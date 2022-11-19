import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { userRoute } from '../../core/routes/user.route';
import { dataDashRoute } from '../../core/routes/data-dash.route';
import { absolutePath } from '../../core/utils/route.util';
import { AuthGuard } from '../../core/guards/auth.guard';

import { DashboardLayoutComponent } from '../../layout/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: userRoute.notifications,
        loadChildren: () => import('./notification/notification.module').then((m) => m.NotificationModule),
      },
      {
        path: userRoute.account,
        loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),
      },
      { path: '**', redirectTo: absolutePath([dataDashRoute.root]) },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
