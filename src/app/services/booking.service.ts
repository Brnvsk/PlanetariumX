import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay } from 'rxjs';
import { IShow, IShowSession } from '../types/show.types';
import { HttpClient } from '@angular/common/http';
import { ApiRoutes } from '../config/network.config';
import { IBooking } from '../types/booking.types';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private showsStore$ = new BehaviorSubject<IShow[]>([])
  public shows$ = this.showsStore$.asObservable().pipe(
    shareReplay(1)
  )

  public set shows(value: IShow[]) {
    this.showsStore$.next(value)
  }

  constructor(private http: HttpClient) {
    this.loadAllShows()
  }

  public loadAllShows() {
    this.http.get<{ data: IShow[] }>(`${ApiRoutes.shows}`).subscribe(res => {
      this.showsStore$.next(res.data)
    })
  }

  public getShowById(id: string) {
    return this.http.get<IShow | null>(`${ApiRoutes.shows}/${id}`)
  }

  public getShowTimeslots(showId: number) {
    return this.http.get<{ data: IShowSession[] }>(`${ApiRoutes.shows.timeslots}/${showId}`).pipe(
      map(res => res.data)
    )
  }

  public saveBooking(booking: IBooking) {
    return this.http.post<{ message: string }>(`${ApiRoutes.booking.save}`, booking)
  }

  public getShowBookings(showId: number) {
    return this.http.get<{ data: IBooking[] }>(`${ApiRoutes.booking.bookings}/${showId}`).pipe(map(res => res.data))
  }

  public getAllSessions() {
    return this.http.get<{ data: IShowSession[] }>(`${ApiRoutes.sessions}`).pipe(map(res => res.data))
  }
}
