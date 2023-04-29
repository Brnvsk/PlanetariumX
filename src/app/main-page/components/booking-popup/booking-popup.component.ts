import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBooking, IBookingInfo } from 'src/app/types/booking.types';

export interface BookingDialogData {
  booking: IBookingInfo
}

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.component.html',
  styleUrls: ['./booking-popup.component.scss']
})
export class BookingPopupComponent implements OnInit {
  public booking!: IBookingInfo
  
  public get date() {
    return `${this.booking.date} ${this.booking.time} `  
  }

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: BookingDialogData,
  ) {
    this.booking = data.booking
  }

  public ngOnInit(): void {
    
  }

  public onChangeEmail(e: Event) {
    const value = (e.target as HTMLInputElement).value

    this.booking.email = value;
  }

  public makeBooking() {
    if (!this.booking.userId && !this.booking.email) {
      console.warn('No user or email');
      return;
    }
    this.dialogRef.close({
      booking: this.booking
    })
  }

  public onClose() {
    this.dialogRef.close({
      canceled: true
    })
  }

}
