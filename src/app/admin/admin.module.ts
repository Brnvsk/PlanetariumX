import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminShowsComponent } from './components/admin-shows/admin-shows.component';
import { AdminBookingsComponent } from './components/admin-bookings/admin-bookings.component';
import { AdminNewsComponent } from './components/admin-news/admin-news.component';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { CreateShowModalComponent } from './modals/create-show-modal/create-show-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateShowModalComponent } from './modals/update-show-modal/update-show-modal.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminShowsComponent,
    AdminBookingsComponent,
    AdminNewsComponent,
    CreateShowModalComponent,
    UpdateShowModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
  ]
})
export class AdminModule { }
