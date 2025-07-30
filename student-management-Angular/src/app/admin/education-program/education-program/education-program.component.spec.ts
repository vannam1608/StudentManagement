import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationProgramComponent } from './education-program.component';

describe('EducationProgramComponent', () => {
  let component: EducationProgramComponent;
  let fixture: ComponentFixture<EducationProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationProgramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EducationProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
