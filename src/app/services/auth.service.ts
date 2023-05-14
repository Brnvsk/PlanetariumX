import { ObserversModule } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, BehaviorSubject, of, map } from 'rxjs';

import { RoleUsers } from '../shared/types/role-users.enum';
import { TempUser, User } from '../shared/types/user.type';
import { HttpClient } from '@angular/common/http';
import { ApiRoutes } from '../config/network.config';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  public login(email: string, password: string) {
    const url = ApiRoutes.users.login
    return this.http.post<{ user: User | null }>(url, {
      user: {
        email,
        password,
      },
    })
  }

  register(user: TempUser) {
    const {
      email,
      login,
      password,
      interested,
      avatarId
    } = user
    const payload = {
      email,
      login,
      password,
      tags: interested,
      avatarId
    }

    const url = ApiRoutes.users.register
    return this.http.post<{ data: User }>(url, {
      user: payload,
    }).pipe(
      map(res => res.data)
    )
  }
}



/*
export const users = [
 {
  login: 'mrn',
  password: '1234qwer!',
  email: 'mrn@gmail.com',
  role: RoleUsers.USER
 },
 {
  login: 'Katletka',
  password: '1234qwer!',
  email: 'katletka@gmail.com',
  role: RoleUsers.USER
 },
 {
  login: 'Svetka',
  password: '1234qwer!',
  email: 'svetka@gmail.com',
  role: RoleUsers.USER
 }
] */
