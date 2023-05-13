import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, combineLatest, filter, map, of, switchMap } from 'rxjs';
import { AvatarsMap } from 'src/app/config/avatars.config';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { NewsService } from 'src/app/services/news.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/types/user.type';
import { IBooking, IUserBooking } from 'src/app/types/booking.types';
import { INewsTag } from 'src/app/types/news.types';
import { EditNewsTagsModalComponent } from '../modals/edit-news-tags-modal/edit-news-tags-modal.component';


@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.scss']
})
export class PersonalAreaComponent implements OnInit {
  public user$ = this.userService.user$;
  public userTags: INewsTag[] = [];

  public bookings: IUserBooking[] = []

  public discount!: number;

  public get avatarSrc() {
    return ''
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private newsService: NewsService,
    private dialog: MatDialog,
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

  public editTags(userTags: INewsTag[]) {
    const dialogRef = this.dialog.open(EditNewsTagsModalComponent, {
      data: { userTags }
    })

    dialogRef.afterClosed().subscribe((res?: { result: 'cancel' | 'success' | 'error', tags?: ( INewsTag & { checked: boolean } )[] }) => {
      // console.log(res);
      if (res && res.result === 'success' && res.tags != null) {
        const tagsStr = res.tags.length > 0 ? res.tags.filter(t => t.checked).map(t => t.id).join('-') : ''
        console.log(tagsStr);
      }
    })
  }

}
