import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformExercisesComponent } from './platform-exercises.component';

describe('PlatformExercisesComponent', () => {
  let component: PlatformExercisesComponent;
  let fixture: ComponentFixture<PlatformExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformExercisesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
