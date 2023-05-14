import { Component, Input, DoCheck, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  @Input() public progressValue: number = 0;

  public user$ = this.userService.user$;
  public userRoles!: RoleUsers;

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
    private forwards: ForwardsService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {

  }

  changeProgress(event: any): number {
    this.progressValue = this.changeProgressService.changeProgress(event);
    return this.progressValue;
  }


  login(): void {
    this.router.navigate(['login']);
  }

  personal(): void {
    this.router.navigate(['personal']);
  }

}
