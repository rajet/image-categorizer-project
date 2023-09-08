import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  AuthPipe,
  AuthPipeGenerator,
} from '@angular/fire/auth-guard';
import { User } from '@angular/fire/auth';
import { map } from 'rxjs';
const redirectUnauthorizedToLoginPipeGenerator: AuthPipeGenerator = () =>
  redirectUnauthorizedToLogin;
const redirectUnauthorizedToLogin: AuthPipe = map((user: User | null) => {
  return user ? true : ['login'];
});

const redirectAuthorizedToHomePipeGenerator: AuthPipeGenerator = () =>
  redirectAuthorizedToHome;
const redirectAuthorizedToHome: AuthPipe = map((user: User | null) => {
  return user ? ['dashboard'] : true;
});
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLoginPipeGenerator },
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectAuthorizedToHomePipeGenerator },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
