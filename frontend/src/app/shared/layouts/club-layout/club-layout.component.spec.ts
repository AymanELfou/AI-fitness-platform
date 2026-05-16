import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubLayoutComponent } from './club-layout.component';

describe('ClubLayoutComponent', () => {
  let component: ClubLayoutComponent;
  let fixture: ComponentFixture<ClubLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
