import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BookedTicket, DATE, Ticket } from 'src/app/shared/types/ticket.type';
import { Observable, filter, BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ChooseSessionsService {

  public tempSessions: Ticket[] = [];
  public selectedSession!: Ticket;
  public chooseSessions: Ticket[] = [];
  public chooseDaySessions: Ticket[] = [];
  public allDate!: DATE[];
  public day!: string;
  public reservedSeats: BookedTicket[] = [];
  public currentHour!: string;


  constructor(
    private router: Router,
  ) { }

  booking(session: Ticket, allDate: DATE[]) : void {
    this.allDate = allDate;
    this.selectedSession = session;

  }



  chooseDay(event: any): void {
    if( event.target.firstElementChild === null) {
      let active = document.querySelector('.active');
      if(active) active.classList.remove('active');
      event.target.classList.add('active');
      this.allDate = [];
      this.chooseSessions = [];
      this.day = event.target.innerHTML;

      for(let item of this.tempSessions) {
        if(item.date) {
          for(let i of item.date) {
            if(i.item.toLocaleDateString('ru', {day: 'numeric'}) === this.day) {
              this.chooseSessions.push(item);
              break;
            }
          }
        }
      }

      for(let item of this.chooseSessions) {
        this.allDate =  this.allDate.concat(item.date!.filter((value, index, self) =>
          value.item.toLocaleDateString('ru', {day: 'numeric'}) === this.day
        ))
        this.allDate = this.allDate.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.item.toLocaleString('ru', {hour: 'numeric'}) == value.item.toLocaleString('ru', {hour: 'numeric'})
          ))
        )

      }
      this.allDate.sort((a, b) => {
        if(a.item.toLocaleString('ru', {hour: 'numeric'}) < b.item.toLocaleString('ru', {hour: 'numeric'})) {
          return -1;
        }
        if(b.item.toLocaleString('ru', {hour: 'numeric'}) < a.item.toLocaleString('ru', {hour: 'numeric'})) {
          return 1;
        }
        return 0;
      });
      this.chooseDaySessions = Array.from(this.chooseSessions);
      console.log(this.allDate)
    }
  }

  choiceTime(event: any): void {
    console.log(event)
    let temp: string[] = [];
    let tempStr = event.source._elementRef.nativeElement.lastChild.lastChild.innerHTML.split(':');
    this.currentHour = event.source._elementRef.nativeElement.lastChild.lastChild.innerHTML;
    console.log(this.currentHour);
    if(event.checked) {
      this.chooseSessions.findIndex((value, index, self) => {
        for(let valueItem of value.date!) {
          let current = valueItem.item.toLocaleString('ru', {hour: 'numeric'}).charAt(0) === '0' ? valueItem.item.toLocaleString('ru', {hour: 'numeric'}).substring(1) : valueItem.item.toLocaleString('ru', {hour: 'numeric'});
          if(Number(current) === Number(tempStr[0])){
            temp.push(value.name);
          }
        }
      })

      temp = temp.filter(function(item, pos) {
        return temp.indexOf(item) == pos;
      })

      for(let i = 0; i < this.chooseSessions.length; i++) {
        if(temp.join().indexOf(this.chooseSessions[i].name, 0) < 0) {
          this.chooseSessions.splice(i, 1);
          i--;
          continue;
        }
      }
    } else {
      this.chooseSessions = Array.from(this.chooseDaySessions);
    }

  }

}
