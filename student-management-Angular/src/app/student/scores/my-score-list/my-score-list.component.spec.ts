import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyScoreListComponent } from './my-score-list.component';

describe('MyScoreListComponent', () => {
  let component: MyScoreListComponent;
  let fixture: ComponentFixture<MyScoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyScoreListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyScoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
