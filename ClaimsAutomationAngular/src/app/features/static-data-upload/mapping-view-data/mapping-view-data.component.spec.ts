import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingViewDataComponent } from './mapping-view-data.component';

describe('MappingViewDataComponent', () => {
  let component: MappingViewDataComponent;
  let fixture: ComponentFixture<MappingViewDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingViewDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingViewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
