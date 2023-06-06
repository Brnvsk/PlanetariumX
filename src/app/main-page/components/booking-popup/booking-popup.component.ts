import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { format } from 'date-fns/esm';
import { apiUrl } from 'src/app/config/network.config';
import { IBooking, IBookingCreate } from 'src/app/types/booking.types';

export interface BookingDialogData {
  booking: IBookingCreate
}

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.component.html',
  styleUrls: ['./booking-popup.component.scss']
})
export class BookingPopupComponent implements OnInit {
  public api = apiUrl
  public booking!: IBookingCreate
  
  public get datetime() {
    return `${format(new Date(this.booking.date), 'dd.MM.yy')} ${this.booking.time} `  
  }

  public address = ''

  public noEmailError = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: BookingDialogData,
    private router: Router,
  ) {
    this.booking = data.booking
    this.address = this.booking.address
  }

  public ngOnInit(): void {
    
  }

  public onChangeEmail(e: Event) {
    const value = (e.target as HTMLInputElement).value
    this.noEmailError = false
    this.booking.email = value;
  }

  public makeBooking() {
    if (!this.booking.userId && !this.booking.email) {
      this.noEmailError = true
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

  public goToLogin() {
    setTimeout(() => {
      this.onClose() 
    });
    this.router.navigate(['/main/login'])
  }

  public cancel() {
    this.dialogRef.close()
  }
}
