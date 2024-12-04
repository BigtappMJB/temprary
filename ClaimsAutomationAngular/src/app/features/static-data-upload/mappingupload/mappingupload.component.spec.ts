import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappinguploadComponent } from './mappingupload.component';

describe('MappinguploadComponent', () => {
  let component: MappinguploadComponent;
  let fixture: ComponentFixture<MappinguploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappinguploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappinguploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
