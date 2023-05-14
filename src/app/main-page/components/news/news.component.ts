import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewsContentModalComponent } from 'src/app/components/modals/news-content-modal/news-content-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { NewsService } from 'src/app/services/news.service';
import { News, OneNews } from 'src/app/shared/types/news.type';
import { news } from 'src/app/types/mocData';
import { INews } from 'src/app/types/news.types';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public news: INews[] = [];

  public isMoreNews: boolean = false;


  constructor(
    private newsService: NewsService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
      this.newsService.getNews().subscribe(res => {
        this.news = res.data
      })
  }

  openNewsModal(item: INews) {
    console.log(item);
    this.dialog.open(NewsContentModalComponent, {
      data: item
    })
  }

  exit() {
    this.isMoreNews = false;
  }

}