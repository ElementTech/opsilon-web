import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'History',
    loadComponent: async () => (await import('./history.component')).HistoryComponent,
  },
];
