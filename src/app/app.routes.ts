import { Routes } from '@angular/router';
import { gestGuard } from './core/guards/gest-guard';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./authentication/authentication.routes').then(a => a.authenticationRoutes),
    canActivate:[gestGuard]
  },
  {
    path: 'employee',
    loadChildren: () => import('./features/employee/employee.routes').then(a => a.employeeRoutes),
    canActivate:[authGuard]
  }

];
