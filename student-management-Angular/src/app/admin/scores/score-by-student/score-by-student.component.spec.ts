import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreByStudentComponent } from './score-by-student.component';

describe('ScoreByStudentComponent', () => {
  let component: ScoreByStudentComponent;
  let fixture: ComponentFixture<ScoreByStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreByStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreByStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
