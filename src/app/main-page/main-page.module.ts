import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './components/view/view.component';
import { MainPageRoutingModule } from './main-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { NewsComponent } from './components/news/news.component';
import {MatMenuModule} from '@angular/material/menu';
import { SharedModule } from '../shared/shared.module';
import { BookingPopupComponent } from './components/booking-popup/booking-popup.component';


@NgModule({
  declarations: [
    ViewComponent,
    BookingPageComponent,
    SessionsComponent,
    AboutUsComponent,
    NewsComponent,
    BookingPopupComponent
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDialogModule,
  ]

})
export class MainPageModule { }
