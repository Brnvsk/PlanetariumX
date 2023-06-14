import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminShowsComponent } from './components/admin-shows/admin-shows.component';
import { AdminBookingsComponent } from './components/admin-bookings/admin-bookings.component';
import { AdminNewsComponent } from './components/admin-news/admin-news.component';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CreateShowModalComponent } from './modals/create-show-modal/create-show-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateShowModalComponent } from './modals/update-show-modal/update-show-modal.component';
import { AdminSessionsComponent } from './components/admin-sessions/admin-sessions.component';
import { CreateSessionModalComponent } from './modals/create-session-modal/create-session-modal.component';
import { UpdateSessionModalComponent } from './modals/update-session-modal/update-session-modal.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateNewsModalComponent } from './modals/create-news-modal/create-news-modal.component';
import { UpdateNewsModalComponent } from './modals/update-news-modal/update-news-modal.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { AdminTagsComponent } from './components/admin-tags/admin-tags.component';
import { CreateTagModalComponent } from './modals/create-tag-modal/create-tag-modal.component';
import { UpdateTagModalComponent } from './modals/update-tag-modal/update-tag-modal.component';
import { ValdemortModule } from 'ngx-valdemort';


@NgModule({
  declarations: [
    AdminComponent,
    AdminShowsComponent,
    AdminBookingsComponent,
    AdminNewsComponent,
    CreateShowModalComponent,
    UpdateShowModalComponent,
    AdminSessionsComponent,
    CreateSessionModalComponent,
    UpdateSessionModalComponent,
    CreateNewsModalComponent,
    UpdateNewsModalComponent,
    AdminTagsComponent,
    CreateTagModalComponent,
    UpdateTagModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    SharedModule,
    MatButtonModule,
    ValdemortModule,
  ],
  providers: [  
    MatDatepickerModule,  
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}
  ],
})
export class AdminModule { }
