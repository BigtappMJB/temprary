import { TestBed } from '@angular/core/testing';

import { FileMappingService } from './file-mapping.service';

describe('FileMappingService', () => {
  let service: FileMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
