import { AfterContentInit, Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { News } from 'src/app/shared/types/news.type';
import { news } from 'src/app/types/mocData';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements AfterContentInit {

  @Input() viewNews: News[] = news;

  constructor(
    private authService: AuthService
  ) { }


  ngAfterContentInit(): void {
    let news = document.querySelector('.newsA');
    for(let j = 0; j < this.viewNews.length; j++) {
      if(this.viewNews[j].content) {
        for(let i = 0; i < this.viewNews[j].content!.length; i++) {
          let oneNews = document.createElement('div');
          oneNews.classList.add('new');
          oneNews.style.cssText = `
            width: 23%;
            display: flex;
            flex-direction: column;
            padding-bottom: 30px;
          `

          let img = document.createElement('img');

          img.setAttribute('src', `${this.viewNews[j].picture![i]}`);

          let newTags = document.createElement('div');
          newTags.classList.add('new-tags');
          newTags.style.cssText = `
            color: #E7D795;
            padding: 10px 0;
            font-size: 12px;
          `

          let imgEllipse = document.createElement('img');
          imgEllipse.setAttribute('src', 'assets/images/ellipse.png');
          imgEllipse.style.cssText = `
            padding-right: 5px;
          `

          let header = document.createElement('span');
          header.innerHTML = this.viewNews[j].header;

          let content = document.createElement('span');
          content.innerHTML = this.viewNews[j].content![i];
          content.style.cssText = `
            width: 80%;
          `

          newTags.append(imgEllipse);
          newTags.append(header);
          oneNews.append(img);
          oneNews.append(newTags);
          oneNews.append(content);
          news?.append(oneNews);
        }
      }

    }

  }
}
