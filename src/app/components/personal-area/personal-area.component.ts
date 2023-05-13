import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AvatarsMap } from 'src/app/config/avatars.config';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/types/user.type';
import { IBooking, IUserBooking } from 'src/app/types/booking.types';


@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.scss']
})
export class PersonalAreaComponent implements OnInit {
  public user$ = this.userService.user$;

  public bookings: IUserBooking[] = []

  public discount!: number;

  public get avatarSrc() {
    return ''
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private bookingService: BookingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.bookingService.getUserBookings(user?.id)
        }
        return of(null)
      })
    ).subscribe(res => {
      this.bookings = res ? res : []
    })
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigateByUrl('/main/app')
    });
  }

  public getAvatar(user: User) {
    const avatar = AvatarsMap.find(avatar => avatar.id === user.avatarId) ?? AvatarsMap[0]
    return `assets/images/user-bonsticks/${avatar.src}`
  }

}
