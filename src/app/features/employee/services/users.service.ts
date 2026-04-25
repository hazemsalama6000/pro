import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IUser } from '../models/IUser.interface';

@Injectable()
export class UsersService {
  private http = inject(HttpClient);
  private base = `${environment.api_url}/users`;

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.base);
  }

  createUser(user: Omit<IUser, 'id'>): Observable<IUser> {
    return this.http.post<IUser>(this.base, user);
  }

  updateUser(id: number, user: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.base}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
