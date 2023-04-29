import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMemoryComponent } from './card-memory.component';

describe('CardMemoryComponent', () => {
  let component: CardMemoryComponent;
  let fixture: ComponentFixture<CardMemoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardMemoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMemoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
