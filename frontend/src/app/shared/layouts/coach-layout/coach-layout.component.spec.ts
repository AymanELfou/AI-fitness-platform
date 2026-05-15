import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachLayoutComponent } from './coach-layout.component';

describe('CoachLayoutComponent', () => {
  let component: CoachLayoutComponent;
  let fixture: ComponentFixture<CoachLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
