import { TestBed } from '@angular/core/testing';

import { MappingViewService } from './mapping-view.service';

describe('MappingViewService', () => {
  let service: MappingViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappingViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
