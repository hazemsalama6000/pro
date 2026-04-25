import { Routes } from "@angular/router";


export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(a => a.EmployeeLayoutComponent),
    children: [
      {
        path:'employees',
        loadComponent:()=>import('./employees/employees.component').then(a=>a.EmployeesComponent)
      }
    ]
  }
];
