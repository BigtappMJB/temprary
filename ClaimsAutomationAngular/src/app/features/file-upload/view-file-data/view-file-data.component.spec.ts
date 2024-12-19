import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFileDataComponent } from './view-file-data.component';

describe('ViewFileDataComponent', () => {
  let component: ViewFileDataComponent;
  let fixture: ComponentFixture<ViewFileDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFileDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
