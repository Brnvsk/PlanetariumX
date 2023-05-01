import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { LoginComponent } from '../components/login/login.component';
import { PersonalAreaComponent } from '../components/personal-area/personal-area.component';
import { RegistrationComponent } from '../components/registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'app',
        loadChildren: () => import('../main-page/main-page.module').then(m => m.MainPageModule)
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'registration',
        component: RegistrationComponent
      },
      {
        path: 'personal',
        component: PersonalAreaComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
