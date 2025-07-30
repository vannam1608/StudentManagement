import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPostsComponent } from './class-posts.component';

describe('ClassPostsComponent', () => {
  let component: ClassPostsComponent;
  let fixture: ComponentFixture<ClassPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
