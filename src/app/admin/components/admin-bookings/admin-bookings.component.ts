import { Component } from '@angular/core';
import { IBooking } from 'src/app/types/booking.types';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.scss']
})
export class AdminBookingsComponent {

  public bookings: IBooking[] = []
  public columns = ['id', 'poster', 'title', 'price', 'actions']


}
