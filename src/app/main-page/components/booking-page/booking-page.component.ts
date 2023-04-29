import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BookedTicket, DATE, Ticket } from 'src/app/shared/types/ticket.type';
import { ChooseSessionsService } from '../../services/choose-sessions.service';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { Observable, filter, map, share, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs';
import { IShow, IShowTimeslot } from 'src/app/types/show.types';
import { FormBuilder } from '@angular/forms';
import { isEqualDates } from 'src/app/helpers/time.helper';
import { getSeatsMap } from 'src/app/config/seats.config';
import { createSeatFromDataset } from 'src/app/helpers/seats-map.helper';
import { IBooking, IBookingInfo } from 'src/app/types/booking.types';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingPopupComponent } from '../booking-popup/booking-popup.component';

export interface ISeatOptions {
  side: 'left' | 'right',
  row: number,
  place: number
}

const defaulSeatColor = '#fff'
const pickedSeatColor = '#6858DC'

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent implements OnInit {
  public filtersForm;
  public selectedSession!: Ticket;
  public allDate: DATE[] = [];
  public month: string[] = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ]
  public day: string[] = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье'
  ]

  @ViewChild('circleContainer') public circleContainer!: ElementRef<SVGSVGElement>
  public isLoadingBookings = true;

  public show$!: Observable<IShow | null>
  public timeslots$!: Observable<IShowTimeslot[]>
  public timeSlotsForDate: IShowTimeslot[] = []
  public seatsStr = ''
  public showBookings$!: Observable<IBooking[]>
  
  private initialDate = new Date()
  // private showTimeSlots: IShowTimeslot[] = []
  private seatsCollection!: NodeListOf<SVGGElement>
  private pickedSeats: ISeatOptions[] = []

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.filtersForm = this.fb.group({
      date: this.initialDate,
      time: '',
      address: ''
    })

    this.filtersForm.valueChanges.subscribe(value => {
      const { date } = value;

      // if (date) {
      //   this.timeSlotsForDate = this.getShowTimeSlotsForDate(date)
      //   this.filtersForm.controls.time.setValue(
      //     this.timeSlotsForDate[0] ?? null, 
      //     { onlySelf: true }
      //   )
      // }

    })
  }

  ngOnInit(): void {
    this.show$ = this.bookingService.shows$.pipe(
      withLatestFrom(this.activatedRoute.paramMap),
      map(([shows, params]) => {
        const showId = Number(params.get('id'));
        const show = shows.find(show => show.id === showId) ?? null;
        return show
      }),
      shareReplay(1)
    );

    this.timeslots$ = this.show$.pipe(
      filter(Boolean),
      switchMap(show => {
        return this.bookingService.getShowTimeslots(show.id!)
      }),
      shareReplay(1),
    )

    this.showBookings$ = this.show$.pipe(
      filter(Boolean),
      switchMap((show) => {
        return this.bookingService.getShowBookings(show.id)
      })
    )

    // this.filtersForm.valueChanges.subscribe(res => {
    //   console.log(res);
    // })

    this.filtersForm.valueChanges.pipe(
      withLatestFrom(this.showBookings$, this.timeslots$),
    ).subscribe(([model, bookings, timeslots]) => {
      const { date } = model
      this.timeSlotsForDate = this.getTimeOptionsForDate(date ?? this.initialDate, timeslots)
      this.filtersForm.controls.time.setValue(this.timeSlotsForDate[0].time, {
        onlySelf: true
      })
      
      console.log(bookings);
      this.renderSeatsMap(bookings)
    })

    this.timeslots$.subscribe(timeslots => {
      if (timeslots) {
        console.log(timeslots);
        
        this.timeSlotsForDate = this.getTimeOptionsForDate(this.initialDate, timeslots)
      }
    })
  }

  public onBook() {
    const { date, time } = this.filtersForm.value
    if (!date || !time || this.pickedSeats.length < 1) {
      return;
    }

    this.show$.pipe(
      filter(Boolean),
      withLatestFrom(this.userService.user$),
    ).subscribe(([ show, user ]) => {
      const booking: IBookingInfo = {
        date: date.toString(),
        time,
        places: this.pickedSeats,
        show: show,
        userId: user ? user.id : undefined
      }

      const ref = this.dialog.open(BookingPopupComponent, {
        data: { booking }
      })

      ref.afterClosed().pipe(
        tap(result => {
          if (result.booking) {
            this.saveBooking(result.booking)
          }
        })
      ).subscribe()
    })
  }

  public onMapClick(e: Event) {
    let target: Element | null = e.target as Element

    if (target.tagName.toUpperCase() === 'PATH') {
      target = target.parentElement
    }

    if (target && target.tagName.toUpperCase() === 'G') {
      this.handleSeatClick(target as HTMLElement)
    }
  }

  private saveBooking(bookingRequest: IBookingInfo){
    this.bookingService.saveBooking({
      date: bookingRequest.date,
      time: bookingRequest.time,
      userId: bookingRequest.userId,
      showId: bookingRequest.show.id,
      places: JSON.stringify(bookingRequest.places),
    }).subscribe(res => {
      console.log('create booking', res);
    })
  }

  private renderSeatsMap(bookings: IBooking[]) {
    const { date, time, address } = this.filtersForm.value
    // console.log('render', this.filtersForm.value);
    const mapPlaces = bookings.filter(booking => {
      const isSameDates = new Date(booking.date).getTime() === date?.getTime()
      const isSameTime = booking.time === time
      if (isSameDates && isSameTime) {
        return true;
      }
      return false;
    }).map(booking => JSON.parse(booking.places) as ISeatOptions[])

    const seatMap = getSeatsMap(mapPlaces.flat())
    this.circleContainer.nativeElement.append(...seatMap)
    this.seatsCollection = this.circleContainer.nativeElement.querySelectorAll('g.seat-item')
  }

  private handleSeatClick(seat: HTMLElement) {
    const seatItem = createSeatFromDataset(seat.dataset)
    if (!seatItem) {
      console.log('Incorrect seat parameters');
      return;
    }

    const seatIndex = this.findSeatIndex(seatItem)

    if (seatIndex === -1) {
      this.pickedSeats.push(seatItem)
    } else {
      this.removeSeat(seatIndex)
    }

    this.highlightSeats()
  }

  private removeSeat(index: number) {
    this.pickedSeats = this.pickedSeats.filter((_, i) => {
      return i !== index
    })
  }

  private findSeatIndex(seat: ISeatOptions | null) {
    if (seat === null) {
      return -1;
    }
    const index = this.pickedSeats.findIndex(s => {
        return (seat.place === s.place
        && seat.row === s.row
        && seat.side === s.side)
    })

    return index
  }

  private highlightSeats() {
    this.seatsCollection.forEach(seat => {
      const params = seat.dataset;
      const seatItem = createSeatFromDataset(params)
      const seatIndexInPicked = this.findSeatIndex(seatItem)
      if (seatIndexInPicked >= 0) {
        seat.style.fill = pickedSeatColor
      } else {
        seat.style.fill = defaulSeatColor
      }
    })
  }

  private getTimeOptionsForDate(date: Date, timeslots: IShowTimeslot[]) {
    const timeSlots = timeslots
      .filter(slot => isEqualDates(new Date(slot.date), date))
      .filter((slot, i, arr) => arr.indexOf(slot) === i)
console.log(timeSlots);

    return timeSlots
  }

  // private initTimeOptions(date: Date, timeslots: IShowTimeslot[]) {
  //   const time = this.getShowTimeSlotsForDate(date, timeslots)[0] ?? null
  //   console.log(time, timeslots);
  //   this.filtersForm.controls.time.setValue(time, {
  //     onlySelf: true
  //   })
  // }

  // public getShowTimeSlotsForDate(date: Date, timeslots: IShowTimeslot[]): string[] {
  //   const dateSlot = timeslots.filter(slot => isEqualDates(new Date(slot.date), date))
  //   const timeOptions = dateSlot.map(slot => slot.time).filter((time, i, arr) => arr.indexOf(time) === i)
    
  //   return timeOptions
  // }

}
