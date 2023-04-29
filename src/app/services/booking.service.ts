import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay } from 'rxjs';
import { IShow, IShowTimeslot } from '../types/show.types';
import { ShowsMock } from '../types/mocData';
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

  constructor(private http: HttpClient) {
    this.loadAllShows()
  }

  public loadAllShows() {
    this.http.get<{ data: IShow[] }>(`${ApiRoutes.shows.list}`).subscribe(res => {
      this.showsStore$.next(res.data)
    })
  }

  public getShowTimeslots(showId: number) {
    return this.http.get<{ data: IShowTimeslot[] }>(`${ApiRoutes.shows.timeslots}/${showId}`).pipe(
      map(res => res.data)
    )
  }

  public getShowById(id: number) {
    return this.showsStore$.value.find(show => show.id === id) ?? null;
  }

  public saveBooking(booking: IBooking) {
    return this.http.post<{ message: string }>(`${ApiRoutes.booking.save}`, booking)
  }

  public getShowBookings(showId: number) {
    return this.http.get<{ data: IBooking[] }>(`${ApiRoutes.booking.bookings}/${showId}`).pipe(map(res => res.data))
  }
}
