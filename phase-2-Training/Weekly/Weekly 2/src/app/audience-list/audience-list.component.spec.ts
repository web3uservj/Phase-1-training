import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceListComponent } from './audience-list.component';

describe('AudienceListComponent', () => {
  let component: AudienceListComponent;
  let fixture: ComponentFixture<AudienceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudienceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudienceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
