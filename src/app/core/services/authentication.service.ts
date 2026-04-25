import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, delay, map, of } from "rxjs";
import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  userSubject = new BehaviorSubject<any>(this.getUserDate());
  user$ = this.userSubject.asObservable();
  httpClient = inject(HttpClient);

  constructor() { }

  isUserLoggedIn() {
    return localStorage.getItem('token') ? true : false;
  }

  login(form: any) {
    return this.httpClient.post(environment.api_url + '/login', form).pipe(map((res: any) => {
      console.log(res);

      if (res.token) {
        localStorage.setItem('token', res.token);
        this.userSubject.next(this.getUserFromToken(res.token));
      }

      return res;
    }));
  }

  logOut() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  getUserDate() {
    return localStorage.getItem('token') ? this.getUserFromToken(localStorage.getItem('token')) : null ;
  }

  getUserFromToken(token: any) {
    let payloadToken = token.split('.')[1];
    return JSON.parse(atob(payloadToken));
  }

}
