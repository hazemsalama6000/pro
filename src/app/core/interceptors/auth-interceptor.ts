import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  req=req.clone({
    headers:req.headers.set('Authorization','Bearer '+localStorage.getItem('token'))
  });
  
  return next(req);
};
