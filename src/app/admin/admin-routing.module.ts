import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminShowsComponent } from './components/admin-shows/admin-shows.component';
import { AdminBookingsComponent } from './components/admin-bookings/admin-bookings.component';
import { AdminNewsComponent } from './components/admin-news/admin-news.component';
import { AdminSessionsComponent } from './components/admin-sessions/admin-sessions.component';
import { AdminTagsComponent } from './components/admin-tags/admin-tags.component';

const routes: Routes = [{ 
  path: '', 
  component: AdminComponent,
  children: [
    {
      path: 'shows',
      component: AdminShowsComponent,
    },
    {
      path: 'sessions',
      component: AdminSessionsComponent,
    },
    {
      path: 'bookings',
      component: AdminBookingsComponent,
    },
    {
      path: 'news',
      component: AdminNewsComponent,
    },
    {
      path: 'tags',
      component: AdminTagsComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
