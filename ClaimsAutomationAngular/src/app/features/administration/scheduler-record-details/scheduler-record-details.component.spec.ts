import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerRecordDetailsComponent } from './scheduler-record-details.component';

describe('SchedulerRecordDetailsComponent', () => {
  let component: SchedulerRecordDetailsComponent;
  let fixture: ComponentFixture<SchedulerRecordDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulerRecordDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerRecordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
