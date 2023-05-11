import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'solar', 
    loadChildren: () => import('./solar/solar.module').then(m => m.SolarModule) 
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) 
  },
  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
  {
    path: '',
    redirectTo: 'main/app',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
