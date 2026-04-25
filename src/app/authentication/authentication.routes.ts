import { Routes } from "@angular/router";


export const authenticationRoutes:Routes=[
  {path:'login',loadComponent:()=>import('./login/login').then(a=>a.Login)},
  {path:'register',loadComponent:()=>import('./register/register.component').then(a=>a.RegisterComponent)}
];
