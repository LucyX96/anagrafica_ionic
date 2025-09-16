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
  },
  {
    path: 'searchUser',
    loadComponent: () =>
      import('./feature/anagrafica/anagrafica.component').then(
        m => m.AnagraficaComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./feature/anagrafica/register/register.component').then(
        m => m.RegisterComponent
      ),
  },
  {
    path: 'userLogin',
    loadComponent: () =>
      import('./feature/auth/user-login/user-login.component').then(
        m => m.UserLoginComponent
      ),
  },
  {
    path: 'userRegister',
    loadComponent: () =>
      import('./feature/auth/user-register/user-register.component').then(
        m => m.UserRegisterComponent
      ),
  }
  

];
