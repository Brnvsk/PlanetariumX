import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarleyBreakComponent } from './barley-break.component';

describe('BarleyBreakComponent', () => {
  let component: BarleyBreakComponent;
  let fixture: ComponentFixture<BarleyBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarleyBreakComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarleyBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
