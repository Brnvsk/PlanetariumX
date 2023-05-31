import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { NewsContentModalComponent } from 'src/app/components/modals/news-content-modal/news-content-modal.component';
import { apiUrl } from 'src/app/config/network.config';
import { NewsService } from 'src/app/services/news.service';
import { INews, INewsTag } from 'src/app/types/news.types';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  private _news: INews[] = []
  
  public api = apiUrl
  public news: INews[] = [];
  public filtersForm
  public tags: INewsTag[] = [];

  constructor(
    private newsService: NewsService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.filtersForm = this.fb.group({
      tags: [new Array<INewsTag>()],
      search: ''
    })

    this.filtersForm.valueChanges
    .pipe(debounceTime(300))
    .subscribe(filters => {
      this.news = this.filterNews()
    })
  }

  ngOnInit(): void {
      this.newsService.getNews().subscribe(res => {
        this._news = res.data
        this.news = res.data
      })

      this.newsService.tags$.subscribe(tags => this.tags = tags)
  }

  openNewsModal(item: INews) {
    this.dialog.open(NewsContentModalComponent, {
      data: item
    })
  }

  public resetFilters() {
    this.filtersForm.patchValue({
      tags: [],
      search: ''
    });
  }

  private filterNews() {
    const { search, tags } = this.filtersForm.value;

    let result = [...this._news]
    if (search != null && search !== '') {
      result = result.filter(item => item.title.includes(search))
    }

    if (tags && tags.length > 0) {
      result = result.filter(item => item.tags.some(tag => tags.findIndex(t => t.id === tag.id) > -1))
    }

    return result
  }
}