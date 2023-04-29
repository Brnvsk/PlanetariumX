import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { SolarSystemComponent } from './components/solar-system/solar-system.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogWindowComponent } from './components/dialog-window/dialog-window.component';
import {MatButtonModule} from '@angular/material/button';
import { BarleyBreakComponent } from './components/barley-break/barley-break.component';
import {MatTableModule} from '@angular/material/table';
import { CardMemoryComponent } from './components/card-memory/card-memory.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LearningPlanetsComponent } from './components/learning-planets/learning-planets.component';
import { SpyComponent } from './components/spy/spy.component';

@NgModule({
  declarations: [
    MenuComponent,
    SolarSystemComponent,
    DialogWindowComponent,
    BarleyBreakComponent,
    CardMemoryComponent,
    LearningPlanetsComponent,
    SpyComponent
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ]
})
export class GamesModule { }
