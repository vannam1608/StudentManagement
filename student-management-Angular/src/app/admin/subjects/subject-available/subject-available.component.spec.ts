import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectAvailableComponent } from './subject-available.component';

describe('SubjectAvailableComponent', () => {
  let component: SubjectAvailableComponent;
  let fixture: ComponentFixture<SubjectAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectAvailableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
