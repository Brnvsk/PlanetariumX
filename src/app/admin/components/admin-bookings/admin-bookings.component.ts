import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiRoutes } from 'src/app/config/network.config';
import { IBooking, IBookingTableRow } from 'src/app/types/booking.types';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.scss']
})
export class AdminBookingsComponent implements OnInit {

  public bookings: IBookingTableRow[] = []
  public columns = ['bookingId', 'showTitle', 'email', 'places', 'date', 'time', 'address']

  constructor(
    private http: HttpClient,
  ) {

  }

  ngOnInit(): void {
    this.getBookings()
  }

  private getBookings() {
    this.http.get<{ bookings: IBookingTableRow[] }>(`${ApiRoutes.booking}/admin/all`).subscribe(res => {
      this.bookings = res.bookings
    })
  }
}
