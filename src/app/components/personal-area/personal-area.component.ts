import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarsMap } from 'src/app/config/avatars.config';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/types/user.type';


@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.scss']
})
export class PersonalAreaComponent {
  public user$ = this.userService.user$;

  public discount!: number;

  public get avatarSrc() {
    return ''
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) { }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigateByUrl('/app')
    });
  }

  public getAvatar(user: User) {
    const avatar = AvatarsMap.find(avatar => avatar.id === user.avatarId) ?? AvatarsMap[0]
    return `assets/images/user-bonsticks/${avatar.src}`
  }

}
