import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoScoreCreateComponent } from './auto-score-create.component';

describe('AutoScoreCreateComponent', () => {
  let component: AutoScoreCreateComponent;
  let fixture: ComponentFixture<AutoScoreCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoScoreCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoScoreCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
