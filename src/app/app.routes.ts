import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@lib/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('@pages/auth/auth.routes')).ROUTES,
    canLoad: [NoAuthGuard],
  },
  {
    path: 'home',
    loadChildren: async () => (await import('@pages/home/home.routes')).ROUTES,
    canLoad: [AuthGuard],
  },
  {
    path: 'history/:repo/:workflow/:runid',
    loadChildren: async () => (await import('@pages/history/history.routes')).ROUTES,
    canLoad: [AuthGuard],
  },
  {
    path: 'repositories',
    loadChildren: async () => (await import('@pages/repositories/repositories.routes')).ROUTES,
    canLoad: [AuthGuard],
  },
  {
    path: ':repo/:workflow',
    loadChildren: async () => (await import('@pages/profile/profile.routes')).ROUTES,
    canLoad: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: async () => (await import('@pages/settings/settings.routes')).ROUTES,
    canLoad: [AuthGuard],
  },
  {
    path: '**',
    loadComponent: async () => (await import('@pages/screens/not-found/not-found.page')).NotFoundPage,
  },
];
