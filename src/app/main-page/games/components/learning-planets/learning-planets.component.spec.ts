import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPlanetsComponent } from './learning-planets.component';

describe('LearningPlanetsComponent', () => {
  let component: LearningPlanetsComponent;
  let fixture: ComponentFixture<LearningPlanetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningPlanetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningPlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
