import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { AvatarsMap } from 'src/app/config/avatars.config';
import { BookingService } from 'src/app/services/booking.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/types/user.type';
import { IUserBooking } from 'src/app/types/booking.types';
import { INewsTag } from 'src/app/types/news.types';
import { EditNewsTagsModalComponent } from '../modals/edit-news-tags-modal/edit-news-tags-modal.component';
import { HttpClient } from '@angular/common/http';
import { ApiRoutes } from 'src/app/config/network.config';


@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.scss']
})
export class PersonalAreaComponent implements OnInit {
  private user$$ = new BehaviorSubject<User | null>(null)
  
  public user$ = this.user$$.asObservable()
  public news = []

  public bookings: IUserBooking[] = []

  public discount!: number;

  public get avatarSrc() {
    return ''
  }

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private bookingService: BookingService,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => [
      this.user$$.next(user)
    ])

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

  public editTags(user: User) {
    const { tags: userTags } = user
    const dialogRef = this.dialog.open(EditNewsTagsModalComponent, {
      data: { userTags }
    })

    dialogRef.afterClosed().subscribe((res?: { result: 'cancel' | 'success' | 'error', tags?: ( INewsTag & { checked: boolean } )[] }) => {
      if (res && res.result === 'success' && res.tags != null) {
        const tagsStr = res.tags.length > 0 ? res.tags.filter(t => t.checked).map(t => t.id).join('-') : ''

        this.http.patch<{ updated: User }>(`${ApiRoutes.users}/${user.id}`, {
          update: {
            news_tags: tagsStr
          }
        }).subscribe(res => {
          this.user$$.next(res.updated)
        })
      }
    })
  }

}
