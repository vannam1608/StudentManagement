import { TestBed } from '@angular/core/testing';

import { ClassPostService } from './class-post.service';

describe('ClassPostService', () => {
  let service: ClassPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
