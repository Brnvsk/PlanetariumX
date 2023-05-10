import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DATE, Ticket } from 'src/app/shared/types/ticket.type';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { BehaviorSubject, Observable, catchError, combineLatest, filter, map, of, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs';
import { IShow, IShowTimeslot } from 'src/app/types/show.types';
import { FormBuilder } from '@angular/forms';
import { isEqualDates } from 'src/app/helpers/time.helper';
import { getSeatsMap } from 'src/app/config/seats.config';
import { createSeatFromDataset } from 'src/app/helpers/seats-map.helper';
import { IBooking, IBookingCreate } from 'src/app/types/booking.types';
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
  private bookingRefresh$ = new BehaviorSubject<void>(undefined)
  private seatmapSvgEl: SVGSVGElement | null = null
  
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

  @ViewChild('seatMapContainer') public set seatMapContainer(el: ElementRef<SVGSVGElement>) {
    this.seatmapSvgEl = el && el.nativeElement ? el.nativeElement : null
  }

  public isMapBlocked = false;

  public show$!: Observable<IShow | null>
  public timeslots$!: Observable<IShowTimeslot[]>
  public showAddresses: string[] = []
  public timeSlotsForDate: IShowTimeslot[] = []
  public seatsStr = ''
  public showBookings$!: Observable<IBooking[]>
  public showSeatsMap = false;
  
  private initialDate = new Date()

  private seatsCollection!: NodeListOf<SVGGElement>
  public pickedSeats: ISeatOptions[] = []

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.filtersForm = this.fb.group({
      date: new Date(),
      time: '',
      address: ''
    })

    this.filtersForm.valueChanges.subscribe(value => {
      const { date } = value
    })
  }

  ngOnInit(): void {
    this.show$ = this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const showId = String(params.get('id'));
        return this.bookingService.getShowById(showId)
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

    this.showBookings$ = combineLatest([
      this.bookingRefresh$,
      this.show$.pipe(filter(Boolean)),
    ])
    .pipe(
      switchMap(([_, show]) => {
        return this.bookingService.getShowBookings(show.id)
      })
    )

    const addresses$ = this.timeslots$.pipe(
      map((timeslots) => {
        const addresses = timeslots
          .map(slot => slot.address)
          .filter((slot, i, arr) => {
            return arr.indexOf(slot) === i
          })

        this.showAddresses = addresses
        return addresses
      })
    )

    const dateTimeslots$ = combineLatest([
      this.filtersForm.controls.date.valueChanges,
      this.timeslots$,
    ]).pipe(
      map(([date, timeslots]) => {
        const timeSlotsForDate = this.getTimeOptionsForDate(date ?? this.initialDate, timeslots)

        if (timeSlotsForDate.length > 0) {
          this.filtersForm.controls.time.setValue(timeSlotsForDate[0].time, {
            onlySelf: true
          })
        }

        this.timeSlotsForDate = timeSlotsForDate
      })
    )

    combineLatest([
      this.filtersForm.valueChanges,
      this.showBookings$, 
      dateTimeslots$,
      addresses$,
    ])
    .subscribe(([model, bookings, _, addresses]) => {
      const { date, time, address } = this.filtersForm.value
      // console.log('filters', model);
      
      if (!date || !time || !address) {
        // console.warn('Wrong form data');
        this.showSeatsMap = false
        this.clearSeatmap()
        return
      }

      const bookingsForFilters = this.getBookingsForFilters(bookings, date, time, address)
      
      this.renderSeatsMap(bookingsForFilters)
      this.showSeatsMap = true
      this.isMapBlocked = false;
    })

    this.filtersForm.controls.date.setValue(this.initialDate)
  }

  public onBook() {
    this.isMapBlocked = true
    const { date, time, address } = this.filtersForm.value
    if (!date || !time || !address || this.pickedSeats.length < 1) {
      console.warn('Not full form data.');
      this.isMapBlocked = false
      return;
    }

    this.show$.pipe(
      filter(Boolean),
      withLatestFrom(this.userService.user$),
    ).subscribe(([ show, user ]) => {
      const newBooking: IBookingCreate = {
        date: date.toUTCString(),
        time,
        address,
        places: this.pickedSeats,
        show: show,
        userId: user ? user.id : undefined
      }

      const ref = this.dialog.open(BookingPopupComponent, {
        data: { booking: newBooking }
      })

      ref.afterClosed().subscribe(result => {
        if (result.booking) {
          this.saveBooking(result.booking)
        } else {
          this.isMapBlocked = false;
        }
      })
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

  private getBookingsForFilters(bookings: IBooking[], date: Date, timeslot: string, address: string) {
    return bookings.filter(booking => {
      const isDatesSame = isEqualDates(new Date(booking.date), date)
      const isTimeSame = booking.time === timeslot
      const isSameAddress = booking.address === address
      
      return isDatesSame && isTimeSame && isSameAddress
    })
  }

  private saveBooking(bookingRequest: IBookingCreate){
    this.bookingService.saveBooking({
      date: bookingRequest.date,
      time: bookingRequest.time,
      address: bookingRequest.address,
      userId: bookingRequest.userId,
      showId: bookingRequest.show.id,
      places: bookingRequest.places,
      email: bookingRequest.email
    })
    .pipe(
      catchError(err => {
        this.isMapBlocked = false
        console.error(err.message)
        return of(null)
      })
    )
    .subscribe(res => {
      if (res) {
        this.bookingRefresh$.next()
      }
    })
  }

  private renderSeatsMap(bookings: IBooking[]) {
    const seatMap = getSeatsMap({
      bookedPlaces: bookings
    })

    if (this.seatmapSvgEl) {
      this.seatmapSvgEl.innerHTML = ''
      this.pickedSeats = []
      this.seatmapSvgEl.append(...seatMap)
      this.seatsCollection = this.seatmapSvgEl.querySelectorAll('g.seat-item')
    }
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

  private clearSeatmap() {
    if (this.seatmapSvgEl && this.seatmapSvgEl.innerHTML !== '') {
      this.seatmapSvgEl.innerHTML = ''
    }
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
      if (params['booked']) {
        return;
      }
      const seatItem = createSeatFromDataset(params)
      const isPicked = this.findSeatIndex(seatItem) > -1
      if (isPicked) {
        seat.style.fill = pickedSeatColor
      } else {
        seat.style.fill = defaulSeatColor
      }
    })
  }

  private getTimeOptionsForDate(date: Date, timeslots: IShowTimeslot[]) {
    const timeSlots = timeslots.slice()
      .filter(slot => isEqualDates(new Date(slot.date), date))
      .filter((slot, i, arr) => arr.indexOf(slot) === i)
      .sort((a, b) => Number(a.time.split(':')[0]) - Number(b.time.split(':')[0]))

    return timeSlots
  }

}
