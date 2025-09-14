import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/home/home.page').then(m => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'addUser',
    loadComponent: () =>
      import('./feature/anagrafica/register/register.component')
        .then(m => m.RegisterComponent),
  }
];
