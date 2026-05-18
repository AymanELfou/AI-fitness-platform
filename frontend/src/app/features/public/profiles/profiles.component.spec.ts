import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilesComponent } from './profiles.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProfilesComponent', () => {
  let component: ProfilesComponent;
  let fixture: ComponentFixture<ProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            
            queryParamMap: of({
              get: (key: string) => 'client'
            })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});