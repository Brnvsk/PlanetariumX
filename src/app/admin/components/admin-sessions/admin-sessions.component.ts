import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { BookingService } from 'src/app/services/booking.service';
import { IShow, IShowSession } from 'src/app/types/show.types';
import { CreateSessionModalComponent } from '../../modals/create-session-modal/create-session-modal.component';
import { UpdateSessionModalComponent } from '../../modals/update-session-modal/update-session-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-sessions',
  templateUrl: './admin-sessions.component.html',
  styleUrls: ['./admin-sessions.component.scss']
})
export class AdminSessionsComponent {
  public shows$: Observable<IShow[]> = this.bookingService.shows$
  
  public sessions: IShowSession[] = []
  public columns = ['id', 'showId', 'date', 'time', 'address']

  constructor(
    private bookingService: BookingService,
    private dialogService: MatDialog,
    private http: HttpClient,
  ) {

  }
  
  ngOnInit(): void {
    this.bookingService.getAllSessions().subscribe(sessions => {
      console.log(sessions);
      this.sessions = sessions
    })

  }

  public create(shows: IShow[]) {
    const dialogRef = this.dialogService.open(CreateSessionModalComponent, {
      data: { shows }
    })

    dialogRef.afterClosed().subscribe((res?: { result: 'success' | 'error' | 'cancel', session?: IShowSession }) => {
      if (!res) {
        return;
      }
      
      const { result } = res
      if (result === 'success' && res.session) {
        const show = shows.find(s => s.id === res.session?.showId)

        const newSession = {
          ...res.session,
          showTitle: show?.title
        } 
        this.sessions = [...this.sessions, newSession]
      }
    })
  }

  public edit(show: IShowSession) {
    const dialogRef = this.dialogService.open(UpdateSessionModalComponent, {
      data: { show }
    })
    const indexUpdated = this.sessions.findIndex(s => s.id === show.id)

    dialogRef.afterClosed().subscribe((res?: { result: 'success' | 'error' | 'cancel', session?: IShowSession, message?: string }) => {
      if (!res) {
        return;
      }

      const { result } = res
      if (result === 'success' && res.session) {
        const newItems = this.sessions.slice()
        newItems.splice(indexUpdated, 1, res.session)
        this.sessions = newItems.slice()
      }
    })
  }

  public delete(show: IShowSession, e: Event) {
    (e.target as HTMLButtonElement).disabled = true
    const { id } = show

    this.http.delete<{ created: IShowSession }>(`${ApiRoutes.sessions}/${id}`)
      .subscribe({
        next: res => {
          this.sessions = this.sessions.filter(s => s.id !== id)
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
