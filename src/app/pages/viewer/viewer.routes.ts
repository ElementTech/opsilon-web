import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'Viewer',
    loadComponent: async () => (await import('./viewer.page')).ViewerPage,
  },
];
