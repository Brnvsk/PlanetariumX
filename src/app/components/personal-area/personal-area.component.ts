import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, of, switchMap } from 'rxjs';
import { AvatarsMap } from 'src/app/config/avatars.config';
import { BookingService } from 'src/app/services/booking.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/types/user.type';
import { IUserBooking } from 'src/app/types/booking.types';
import { INews, INewsTag } from 'src/app/types/news.types';
import { EditNewsTagsModalComponent } from '../modals/edit-news-tags-modal/edit-news-tags-modal.component';
import { HttpClient } from '@angular/common/http';
import { ApiRoutes, apiUrl } from 'src/app/config/network.config';
import { NewsContentModalComponent } from '../modals/news-content-modal/news-content-modal.component';


@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.scss']
})
export class PersonalAreaComponent implements OnInit {
  private user$$ = new BehaviorSubject<User | null>(null)
  
  public api = apiUrl
  public user$ = this.user$$.asObservable()
  public news: INews[] = []

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

    this.user$
    .pipe(
      switchMap(user => {
        if (user) {
          return forkJoin({
            bookings: this.bookingService.getUserBookings(user.id),
            news: this.userService.getNews(user.id),
          })
        }
        return of(null)
      })
    )
    .subscribe(res => {
      if (res) {
        this.bookings = res.bookings ?? []
        this.news = res.news ?? []
      }
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
        const tags = res.tags.length > 0 ? res.tags.filter(t => t.checked).map(t => t.id) : []

        this.http.patch<{ updated: User }>(`${ApiRoutes.users}/${user.id}`, {
          update: {
            tags,
          }
        }).subscribe(res => {
          this.user$$.next(res.updated)
        })
      }
    })
  }

  public openNewsModal(item: INews) {    
    this.dialog.open(NewsContentModalComponent, { data: item })
  }

}
