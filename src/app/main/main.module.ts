import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MainPageModule } from '../main-page/main-page.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from '../components/login/login.component';
import { PersonalAreaComponent } from '../components/personal-area/personal-area.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EditNewsTagsModalComponent } from '../components/modals/edit-news-tags-modal/edit-news-tags-modal.component';


@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    EditNewsTagsModalComponent,
    PersonalAreaComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MainPageModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
  ]
})
export class MainModule { }
