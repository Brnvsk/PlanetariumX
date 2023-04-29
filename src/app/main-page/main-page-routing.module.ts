import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ViewComponent } from './components/view/view.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { NewsComponent } from './components/news/news.component';
import { AuthGuard } from '../shared/services/auth-guard.service';



const routes: Routes = [
 {
  path: '',
  redirectTo: 'view',
  pathMatch: 'full'
 },
 {
  path: 'view',
  component: ViewComponent,
 },
 {
  path: 'sessions',
  component: SessionsComponent,
 },
 {
  path: 'sessions/show/:id',
  component: BookingPageComponent
 },
 {
  path: 'about',
  component: AboutUsComponent
 },
 {
  path: 'news',
  component: NewsComponent
 },
 {
  path: 'games',
  loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
 }
];


@NgModule({
  declarations: [

  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class MainPageRoutingModule { }
