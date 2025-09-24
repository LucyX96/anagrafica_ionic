import { Routes } from '@angular/router';
import { AuthGuard } from './feature/auth/auth-guard/auth-guard.component';

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
      import('./feature/components/anagrafica/register/register.component')
        .then(m => m.RegisterComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'searchUser',
    loadComponent: () =>
      import('./feature/components/anagrafica/anagrafica.component').then(
        m => m.AnagraficaComponent
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'userLogin',
    loadComponent: () =>
      import('./feature/auth/user-login/user-login.component').then(
        m => m.UserLoginComponent
      )
  },
  {
    path: 'userRegister',
    loadComponent: () =>
      import('./feature/auth/user-register/user-register.component').then(
        m => m.UserRegisterComponent
      )
  },
  {
    path: 'statistics',
    loadComponent: () => 
      import('./feature/components/statistics/statistics.component').then(
        m => m.StatisticsComponent
      ),
      // canActivate: [AuthGuard]
  },
  {
    path: 'history',
    loadComponent: () => 
      import('./feature/components/history/history.component').then(
        m => m.HistoryComponent
      ),
      // canActivate: [AuthGuard]
  },
  {
    path: 'body',
    loadComponent: () => 
      import('./feature/components/body/body.component').then(
        m => m.BodyComponent
      ),
      // canActivate: [AuthGuard]
  }
  

];
