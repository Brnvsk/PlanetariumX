import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { ValidationService } from 'src/app/shared/services/validation.service';
import { news } from 'src/app/types/mocData';
import { News } from 'src/app/shared/types/news.type';
import { RoleUsers } from 'src/app/shared/types/role-users.enum';
import { IUserAvatar, TempUser, User } from 'src/app/shared/types/user.type';
import { NewsService } from 'src/app/services/news.service';
import { AvatarsMap } from 'src/app/config/avatars.config';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
    public tags$ = this.newsService.tags$;

    public userAvatars: IUserAvatar[] = AvatarsMap

    public activeAvatarIndex: number | null = null;

    @Input() stepRegistration: StepRegistration = StepRegistration.writeData;

    public showPaswword: boolean = false;
    
    public newsItems: News[] = news;

    public form = this.fb.group({
        login: new FormControl<string>('', [
            Validators.required,
            Validators.maxLength(19),
            ValidationService.loginValidator()
        ]),
        email: new FormControl<string>('', [
            Validators.required,
        ]),
        password: new FormControl<string>('', [
            Validators.required,
            Validators.minLength(8),
            ValidationService.passwordValidator()
        ]),
        passwordRepeat: new FormControl<string>('', [
            Validators.required,
            ValidationService.passwordRepeatValidator(),
        ])
    });
    public get steps(): typeof StepRegistration {
        return StepRegistration;
    }
    private tempUser: TempUser | null = null;
    private isSelected: boolean = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private userService: UserService,
        private newsService: NewsService,
    ) {

    }


    pickAvatar(event: Event): void {
        const target = event.target as HTMLImageElement
        const avatarId = target.dataset['avatarId']

        const avatarIndex = this.userAvatars.findIndex(avatar => avatar.id === Number(avatarId))

        this.tempUser!.avatarId = this.userAvatars[avatarIndex].id;

        this.activeAvatarIndex = avatarIndex !== -1 ? avatarIndex : 0;
    }

    changeNews(event: any): void {
        this.tempUser!.interested.find(el => el === event.source.value) ? this.isSelected = false : this.isSelected = true;
        if (this.isSelected) {
            this.tempUser!.interested.push(event.source.value);
        } else {
            let index = this.tempUser!.interested.findIndex(el => el === event.source.value);
            this.tempUser!.interested.splice(index, 1);
        }
    }


    login() {
        this.router.navigate(['login']);
    }

    togglePasswordVisibility() {
        this.showPaswword = !this.showPaswword;
    }

    next(event: any): void {
        if (this.form.valid) {
            switch (this.stepRegistration) {
                case StepRegistration.writeData: {
                    this.tempUser = {
                        login: this.form.value.login!,
                        password: this.form.value.password!,
                        email: this.form.value.email!,
                        role: 'user', // сделать регистрацию админа через чекбокс?
                        avatarId: null,
                        interested: []
                    }
                    this.stepRegistration = StepRegistration.choiceAvatar;

                    break;
                }

                case StepRegistration.choiceAvatar: {
                    if (this.tempUser!.avatarId != null) {
                        this.stepRegistration = StepRegistration.choiceNews;
                    }

                    break;
                }

                case StepRegistration.choiceNews: {
                    if (this.tempUser) {
                        const email = this.tempUser.email;
                        this.authService.register(this.tempUser).subscribe(user => {
                            console.log(user);
                            this.userService.setUser(user)
                            localStorage.setItem('token', email);
                            this.router.navigateByUrl('/main/app')
                        })
                    }
                    
                    break;
                }

                default: {
                    break;
                }
            }
        }
    }

}

let user2: User[] = [];


enum StepRegistration {
    writeData = 1,
    choiceAvatar,
    choiceNews,
    final
}
