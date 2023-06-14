import { Component, Input, DoCheck, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { find, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ChangeProgressService } from 'src/app/shared/services/change-progress.service';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { RoleUsers } from 'src/app/shared/types/role-users.enum';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() public progressValue: number = 0;

  private progressBarWidth = 0;
  private first!: Element | null;
  private last!: Element | null;
  private star!: HTMLImageElement | null;

  public user$ = this.userService.user$;
  public userRoles!: RoleUsers;
  public starLeft = 0;

  public get roleUsers(): typeof RoleUsers {
    return RoleUsers;
  }

  public get _authService(): AuthService {
    return this.authService;
  }

  constructor(
    private changeProgressService: ChangeProgressService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.first = document.querySelector('#first');
    this.last = document.querySelector('#last');
    this.star = document.querySelector('.star');//потом будут проблемы с полосой скролла

    const progressBar = document.querySelector('.header-progress')!;
    this.progressBarWidth = progressBar?.clientWidth
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const active = document.querySelector('.progress-link.active');
      if (active) {
        this.changeProgress({ target: active as HTMLElement } as unknown as Event)
      }
    }, 100);
  }

  changeProgress(event: Event): number {
    const target = event.target as HTMLElement;
    const progress = this.changeProgressService.changeProgress(event);
    this.progressValue = progress / this.progressBarWidth * 100
    const left = progress

    this.starLeft = left;
    return this.progressValue;
  }


  login(): void {
    this.router.navigate(['login']);
  }

  personal(): void {
    this.router.navigate(['/main/personal']);
  }

}
