import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProclsgressComponent } from './proclsgress.component';

describe('ProclsgressComponent', () => {
  let component: ProclsgressComponent;
  let fixture: ComponentFixture<ProclsgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProclsgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProclsgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
