import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceDetailsComponent } from './audience-details.component';

describe('AudienceDetailsComponent', () => {
  let component: AudienceDetailsComponent;
  let fixture: ComponentFixture<AudienceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudienceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudienceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
