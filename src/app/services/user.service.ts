import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, of, shareReplay } from 'rxjs';
import { User } from '../shared/types/user.type';
import { ApiRoutes } from '../config/network.config';
import { INews } from '../types/news.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {  
  private userStore$ = new BehaviorSubject<User | null>(null)
  public user$: Observable<User | null>

  constructor(private http: HttpClient) {
    this.user$ = this.userStore$.asObservable().pipe(shareReplay(1))
  }

  public get user() {
    return this.userStore$.value;
  }

  public getNews(id: number) {
    return this.http.get<{ data: INews[] }>(`${ApiRoutes.users}/${id}/news`)
      .pipe(
        map(res => res.data)
      )
  }

  public getUserByToken(token: string | null) {
    if (!token) {
      this.setUser(null)
      return;
    }
    this.http.post<{ user: User | null }>(`${ApiRoutes.users.login}/token`, {
      token
    })
    .pipe(
      map(res => {
        return res ? res.user : null
      }), 
      shareReplay(1)
    )
    .subscribe(res => {
      this.setUser(res)
    })
  }

  public setUser(user: User | null) {
    this.userStore$.next(user);
    localStorage.setItem('user', JSON.stringify(user))
  }

  public logout() {
    this.setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return of(null)
  }
}
