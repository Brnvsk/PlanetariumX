import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolarRoutingModule } from './solar-routing.module';
import { SolarComponent } from './solar.component';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';


@NgModule({
  declarations: [
    SolarComponent,
    DetailsPopupComponent
  ],
  imports: [
    CommonModule,
    SolarRoutingModule
  ]
})
export class SolarModule { }
