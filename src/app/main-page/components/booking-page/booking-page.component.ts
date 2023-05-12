import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DATE, Ticket } from 'src/app/shared/types/ticket.type';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { BehaviorSubject, Observable, catchError, combineLatest, debounceTime, filter, map, of, shareReplay, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { IShow, IShowSession } from 'src/app/types/show.types';
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
  public hasSession = true;

  public show$!: Observable<IShow | null>
  public timeslots$!: Observable<IShowSession[]>
  public showAddresses: string[] = []
  public availableTimeslots: IShowSession[] = []
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

    combineLatest([
      this.filtersForm.controls.date.valueChanges,
      this.filtersForm.controls.address.valueChanges,
      this.timeslots$,
    ])
    .subscribe(([date, address, timeslots]) => {
      if (!date || !address) {
        return
      }

      const availableTimeslots = this.getTimeOptionsForDate(timeslots, date, address)

      if (availableTimeslots.length > 0) {
        this.filtersForm.controls.time.setValue(availableTimeslots[0].time, {
          onlySelf: true
        })
      } else {
        this.filtersForm.controls.time.setValue(null, {
          onlySelf: true
        })
      }

      this.availableTimeslots = availableTimeslots
      return availableTimeslots
    })

    const addresses$ = this.timeslots$
    .pipe(
      map((timeslots) => {
        const addresses = timeslots
          .map(slot => slot.address)
          .filter((slot, i, arr) => {
            return arr.indexOf(slot) === i
          })

        this.showAddresses = addresses
        const addressValue = timeslots && timeslots.length > 0 ? timeslots[0].address : ''
        this.filtersForm.controls.address.setValue(addressValue)
        return addresses
      })
    )

    combineLatest([
      this.filtersForm.valueChanges,
      this.showBookings$, 
      addresses$,
    ])
    .pipe(
      debounceTime(300),
    )
    .subscribe(([model, bookings, addresses]) => {
      const { date, time, address } = this.filtersForm.value
      console.log('filters', model);
      
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
    )
    .pipe(take(1))
    .subscribe(([ show, user ]) => {
      
      const newBooking: IBookingCreate = {
        date: date.toISOString(),
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
        console.error(err.error.message)
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

  private getTimeOptionsForDate(timeslots: IShowSession[], date: Date, address: string) {    
    const timeSlots = timeslots.slice()
      .filter(slot => {
        return isEqualDates(new Date(slot.date), date) && slot.address === address
      })
      .filter((slot, i, arr) => arr.indexOf(slot) === i)
      .sort((a, b) => Number(a.time.split(':')[0]) - Number(b.time.split(':')[0]))

    return timeSlots
  }

}
