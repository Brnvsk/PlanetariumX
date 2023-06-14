import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(
    private location: Location,
    private userService: UserService,
    private router: Router,
  ) {}

  public exitAdminPanel() {
    this.router.navigateByUrl('/main/app')
  }

  public logout() {
    this.userService.logout()
    this.router.navigateByUrl('/main/app')
  }
}
