import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MenuComponent } from './components/menu/menu.component';
import { SolarSystemComponent } from './components/solar-system/solar-system.component';
import { BarleyBreakComponent } from './components/barley-break/barley-break.component';
import { CardMemoryComponent } from './components/card-memory/card-memory.component';
import { LearningPlanetsComponent } from './components/learning-planets/learning-planets.component';
import { SpyComponent } from './components/spy/spy.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'selected',
    pathMatch: 'full'
  },
  {
    path: 'selected',
    component: MenuComponent,
  },
  {
    path: 'selected/solarSystem',
    component: SolarSystemComponent
  },
  {
    path: 'selected/barleyBreak',
    component: BarleyBreakComponent
  },
  {
    path: 'selected/cardMemory',
    component: CardMemoryComponent
  },
  {
    path: 'selected/learningPlanets',
    component: LearningPlanetsComponent
  },
  {
    path: 'selected/spy',
    component: SpyComponent
  }

];


@NgModule({
  declarations: [

  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class GamesRoutingModule { }
