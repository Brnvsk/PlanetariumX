import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { apiUrl } from 'src/app/config/network.config';
import { BookingService } from 'src/app/services/booking.service';
import { NewsService } from 'src/app/services/news.service';
import { Questions, questions } from 'src/app/types/mocData';
import { INews } from 'src/app/types/news.types';
import { IShow } from 'src/app/types/show.types';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public api = apiUrl
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
