import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { NewsService } from 'src/app/services/news.service';
import { INewsTag } from 'src/app/types/news.types';
import { UpdateTagModalComponent } from '../../modals/update-tag-modal/update-tag-modal.component';
import { CreateTagModalComponent } from '../../modals/create-tag-modal/create-tag-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.scss']
})
export class AdminTagsComponent implements OnInit, OnDestroy {
  public tags: INewsTag[] = []
  public columns = ['id', 'name', 'actions']
  public subs: Subscription[] = []

  constructor(
    private newsService: NewsService,
    private dialogService: MatDialog,
    private http: HttpClient,
  ) {

  }
  
  ngOnInit(): void {
    const newsTagsSub = this.newsService.tags$.subscribe(tags => {
      this.tags = tags
    })
    this.subs.push(newsTagsSub)
  }

  ngOnDestroy(): void {
      this.subs.forEach(s => s.unsubscribe())
  }

  public create() {
    const dialogRef = this.dialogService.open(CreateTagModalComponent, {})

    dialogRef.afterClosed().subscribe((res?: { result: 'success' | 'error' | 'cancel', tag?: INewsTag }) => {
      if (!res) {
        return;
      }
      const { result } = res
      if (result === 'success' && res.tag) {
        this.tags = [...this.tags, res.tag]
        this.newsService.setTags(this.tags);
      }
    })
  }

  public edit(tag: INewsTag) {
    const dialogRef = this.dialogService.open(UpdateTagModalComponent, {
      data: { tag }
    })
    const indexUpdated = this.tags.findIndex(s => s.id === tag.id)

    dialogRef.afterClosed().subscribe((res?: { result: 'success' | 'error' | 'cancel', item?: INewsTag }) => {
      if (!res) {
        return;
      }
      const { result } = res
      if (result === 'success' && res.item) {
        const newItems = this.tags.slice()
        newItems.splice(indexUpdated, 1, res.item)
        this.tags = newItems.slice()
        this.newsService.loadTags()
      }
    })
  }

  public delete(tag: INewsTag, e: Event) {
    (e.target as HTMLButtonElement).disabled = true
    const { id } = tag

    this.http.delete(`${ApiRoutes.news.tags}/${id}`)
      .subscribe({
        next: res => {
          this.tags = this.tags.filter(t => t.id !== id)
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
