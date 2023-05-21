import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiRoutes, apiUrl } from 'src/app/config/network.config';
import { NewsService } from 'src/app/services/news.service';
import { INews } from 'src/app/types/news.types';
import { UpdateNewsModalComponent } from '../../modals/update-news-modal/update-news-modal.component';
import { CreateNewsModalComponent } from '../../modals/create-news-modal/create-news-modal.component';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss']
})
export class AdminNewsComponent {
  public api = apiUrl
  public news: INews[] = []
  public columns = ['id', 'title', 'tags', 'photo', 'actions']
  public tags = this.newsService.tags

  constructor(
    private newsService: NewsService,
    private dialogService: MatDialog,
    private http: HttpClient,
  ) {

  }
  
  ngOnInit(): void {
    this.newsService.getNews().subscribe(res => {
      this.news = res.data
    })    

    this.newsService.tags$.subscribe(tags => {
      this.tags = tags
    })  
  }

  public create() {
    const dialogRef = this.dialogService.open(CreateNewsModalComponent, {
      data: { tags: this.tags }
    })

    dialogRef.afterClosed().subscribe((res?: { result: 'success' | 'error' | 'cancel', news?: INews }) => {
      if (!res) {
        return;
      }
      const { result } = res
      if (result === 'success' && res.news) {
        this.news = [...this.news, res.news]
      }
    })
  }

  public edit(item: INews) {
    const dialogRef = this.dialogService.open(UpdateNewsModalComponent, {
      data: { item, tags: this.tags }
    })
    const indexUpdated = this.news.findIndex(n => n.id === item.id)

    dialogRef.afterClosed().subscribe((res?: { result: 'success' | 'error' | 'cancel', item?: any }) => {
      if (!res) {
        return;
      }
      const { result } = res
      
      if (result === 'success' && res.item) {
        const { item } = res

        const newItems = this.news.slice()

        newItems.splice(indexUpdated, 1, item)

        this.news = newItems.slice()
      }
    })
  }

  public delete(item: INews, e: Event) {
    (e.target as HTMLButtonElement).disabled = true
    const { id } = item

    this.http.delete(`${ApiRoutes.news}/${id}`)
      .subscribe({
        next: res => {
          this.news = this.news.filter(n => n.id !== id)
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
