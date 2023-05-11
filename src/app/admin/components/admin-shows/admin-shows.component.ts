import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { IShow } from 'src/app/types/show.types';
import { CreateShowModalComponent } from '../../modals/create-show-modal/create-show-modal.component';

@Component({
  selector: 'app-admin-shows',
  templateUrl: './admin-shows.component.html',
  styleUrls: ['./admin-shows.component.scss']
})
export class AdminShowsComponent implements OnInit {

  public shows: IShow[] = []
  public columns = ['id', 'poster', 'title', 'price', 'actions']

  constructor(
    private showsService: BookingService,
    private dialogService: MatDialog,
  ) {

  }
  
  ngOnInit(): void {
    this.showsService.shows$.subscribe(shows => {
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
    
  }

  public deleteShow(show: IShow) {
    console.log('delete', show);
  }
}
