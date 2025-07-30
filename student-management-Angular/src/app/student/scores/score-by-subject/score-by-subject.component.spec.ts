import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBySubjectComponent } from './score-by-subject.component';

describe('ScoreBySubjectComponent', () => {
  let component: ScoreBySubjectComponent;
  let fixture: ComponentFixture<ScoreBySubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreBySubjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreBySubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
