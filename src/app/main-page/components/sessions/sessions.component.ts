import { Component } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { IShowSession } from 'src/app/types/show.types';
import { FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { isEqualDates } from 'src/app/helpers/time.helper';
import { add, addWeeks } from 'date-fns';
import { addMonths } from 'date-fns/esm';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent {
  private _sessions: IShowSession[] = []
  private allSessions: IShowSession[] = []

  public times: string[] = []

  public filtersForm;

  public get now() {
    return new Date()
  }

  public get maxFiltersDate() {
    return addMonths(new Date(), 1)
  }

  public set sessions(value: IShowSession[]) {
    const filtered = new Array<IShowSession>()
    
    value.forEach((s, i, arr) => {
      if (filtered.findIndex(it => it.showId === s.showId) === -1) {
        filtered.push(s)
      }
    })
    this._sessions = filtered
  }

  public get sessions() {
    return this._sessions
  }


  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.bookingService.getAllSessions().subscribe(sessions => {
      this.allSessions = sessions
      this.sessions = sessions
      const { times } = this.createFiltersForm(sessions)
      this.times = times
    })

    this.filtersForm = this.fb.group({
      title: '',
      from: new Date(),
      to: addWeeks(new Date(), 1),
      time: [new Array<string>()],
      address: '',
    })

    this.filtersForm.valueChanges
    .pipe(
      debounceTime(300),
    )
    .subscribe(form => {      
      this.sessions = this.filterSessions(form, this.allSessions)
    })
  }

  private createFiltersForm(sessions: IShowSession[]) {
    const times = sessions.map(s => s.time).filter((s, i, arr) => arr.indexOf(s) === i).slice().sort((a, b) => {
      // hours + minutes / 60 - (hours + minutes / 60)
      return Number(a.split(':')[0]) + Number(a.split(':')[1]) / 60 - (Number(b.split(':')[0]) + Number(b.split(':')[1]) / 60)
    })

    return {
      times
    }
  }

  private filterSessions(filters: typeof this.filtersForm.value, allSessions: IShowSession[]) {
    const { time, from, to, title } = filters

    let result = allSessions.slice()
    if (time && time.length > 0) {
      result = result.filter(s => {
        return time.includes(s.time)
      })
    }

    if (from) {      
      result = result.filter(s => {
        const sessionDate = new Date(s.date)
        sessionDate.setMilliseconds(0)
        sessionDate.setSeconds(0)
        sessionDate.setMinutes(0)
        sessionDate.setHours(0)
        const fromUTC = new Date(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())

        return sessionDate > fromUTC || isEqualDates(sessionDate, fromUTC)
      })
    }

    if (to) {      
      result = result.filter(s => {
        const sessionDate = new Date(s.date)
        sessionDate.setMilliseconds(0)
        sessionDate.setSeconds(0)
        sessionDate.setMinutes(0)
        sessionDate.setHours(0)
        const toUTC = new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate())

        return sessionDate < toUTC || isEqualDates(sessionDate, toUTC)
      })
    }

    if (title) {
      result = result.filter(s => {
        return s.showTitle?.toLowerCase()?.includes(title.toLowerCase())
      })
    }

    return result
  }

}
