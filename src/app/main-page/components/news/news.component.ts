import { AfterContentInit, Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { News, OneNews } from 'src/app/shared/types/news.type';
import { news } from 'src/app/types/mocData';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements AfterContentInit {

  @Input() viewNews: News[] = news;
  public isMoreNews: boolean = false;
  public oneNews: OneNews[] = [];
  public selectedNews!: OneNews;

  constructor(
    private authService: AuthService
  ) {
    for(let i = 0; i < this.viewNews.length; i++) {
      if(this.viewNews[i].content) {
        for(let j = 0; j < this.viewNews[i].content!.length; j++) {
          this.oneNews.push(
            {content: this.viewNews[i].content![j], header: this.viewNews[i].header, picture: this.viewNews[i].picture![j]}
          )
        }
      }
    }
    this.selectedNews = this.oneNews[0];
  }


  ngAfterContentInit(): void {

  }



  readMore(event: any) {

    this.oneNews.forEach(val => {
      if(event.target.getAttribute('src') === val.picture) {
        this.selectedNews = val;
      }
    })
    this.isMoreNews = true;
  }

  exit() {
    this.isMoreNews = false;
  }

}