import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolarComponent } from './solar.component';

const routes: Routes = [{ path: '', component: SolarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolarRoutingModule { }
