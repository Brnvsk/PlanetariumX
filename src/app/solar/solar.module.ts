import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolarRoutingModule } from './solar-routing.module';
import { SolarComponent } from './solar.component';


@NgModule({
  declarations: [
    SolarComponent
  ],
  imports: [
    CommonModule,
    SolarRoutingModule
  ]
})
export class SolarModule { }
