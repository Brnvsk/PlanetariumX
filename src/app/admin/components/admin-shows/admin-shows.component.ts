import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { IShow } from 'src/app/types/show.types';
import { CreateShowModalComponent } from '../../modals/create-show-modal/create-show-modal.component';
import { ApiRoutes } from 'src/app/config/network.config';
import { HttpClient } from '@angular/common/http';
import { UpdateShowModalComponent } from '../../modals/update-show-modal/update-show-modal.component';

@Component({
  selector: 'app-admin-shows',
  templateUrl: './admin-shows.component.html',
  styleUrls: ['./admin-shows.component.scss']
})
export class AdminShowsComponent implements OnInit {

  public shows: IShow[] = []
  public columns = ['id', 'poster', 'title', 'price', 'actions']

  constructor(
    private bookingService: BookingService,
    private dialogService: MatDialog,
    private http: HttpClient,
  ) {

  }
  
  ngOnInit(): void {
    this.bookingService.shows$.subscribe(shows => {
      this.shows = shows
    })
  }

  public createShow() {
    const dialogRef = this.dialogService.open(CreateShowModalComponent, {

    })

    dialogRef.afterClosed().subscribe((res: { result: 'success' | 'error' | 'cancel', show?: IShow }) => {
      const { result } = res
      if (result === 'success' && res.show) {
        this.shows = [...this.shows, res.show]
      }
    })
  }

  public editShow(show: IShow) {
    const dialogRef = this.dialogService.open(UpdateShowModalComponent, {
      data: { show }
    })
    const indexUpdated = this.shows.findIndex(s => s.id === show.id)

    dialogRef.afterClosed().subscribe((res: { result: 'success' | 'error' | 'cancel', show?: IShow }) => {
      const { result } = res
      if (result === 'success' && res.show) {
        const newItems = this.shows.slice()
        newItems.splice(indexUpdated, 1, res.show)
        this.shows = newItems.slice()
      }
    })
  }

  public deleteShow(show: IShow, e: Event) {
    (e.target as HTMLButtonElement).disabled = true
    const { id } = show

    this.http.delete<{ created: IShow }>(`${ApiRoutes.shows}/${id}`)
      .subscribe({
        next: res => {
          this.shows = this.shows.filter(show => show.id !== id)
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
