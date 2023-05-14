import { ViewEncapsulation } from '@angular/compiler';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { NewsService } from 'src/app/services/news.service';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { News } from 'src/app/shared/types/news.type';
import { news, Questions, questions } from 'src/app/types/mocData';
import { INews } from 'src/app/types/news.types';
import { IShow } from 'src/app/types/show.types';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public questionsView: Questions[] = questions;
  public news: INews[] = []
  public shows: IShow[] = []

  constructor(
    private cdRef: ChangeDetectorRef,
    private newsService: NewsService,
    private bookingService: BookingService,
    ) {

  }

  ngOnInit(): void {
    this.newsService.getNews().subscribe(res => {
      this.news = res.data.slice(0, 4)
    })

    this.bookingService.loadAllShows()
    this.bookingService.shows$.subscribe(res => {
      this.shows = res.slice(0, 4)
    }) 
  }

}
