import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INews, INewsTag } from '../types/news.types';
import { BehaviorSubject, Observable, of, shareReplay, tap } from 'rxjs';
import { ApiRoutes } from '../config/network.config';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private tagsStore$ = new BehaviorSubject<INewsTag[]>([]);
  
  public tags$: Observable<INewsTag[]>
  public tags: INewsTag[] = []

  constructor(private http: HttpClient) {
    this.tags$ = this.tagsStore$.asObservable().pipe(
      tap(tags => this.tags = tags),
      shareReplay(1)
    );
  }

  public loadTags() {
    return this.http.get<{ data: INewsTag[] }>(`${ApiRoutes.news.tags}`).subscribe(res => {
      this.tagsStore$.next(res.data);
    })
  }

  public getNews() {
    return this.http.get<{ data: INews[] }>(`${ApiRoutes.news}`)
  }

  public setTags(tags: INewsTag[]) {
    this.tagsStore$.next(tags);
  }
}
