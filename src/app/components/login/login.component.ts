import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { RoleUsers } from 'src/app/shared/types/role-users.enum';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public showPaswword: boolean = false;
  public form = this.fb.group({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(19),
      ValidationService.loginValidator()
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      ValidationService.passwordValidator()
    ])
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) { }

  togglePasswordVisibility() {
    this.showPaswword = !this.showPaswword;
  }

  public login(): void {
    const { email, password } = this.form.value;

    if (this.form.valid && email && password) {
      this.authService.login(email, password).subscribe(res => {
        const { user } = res
        if (user) {
          const { email } = user;
          localStorage.setItem('token', email)
          this.router.navigateByUrl('/main/app')
        }
        
        this.userService.setUser(user)
      })
    }
  }

  private openSnackBar() {
    this._snackBar.open('Invalid login or password', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3 * 1000
    });
  }

  goToRegistration(): void {
    this.router.navigate(['./registration']);
  }

}
