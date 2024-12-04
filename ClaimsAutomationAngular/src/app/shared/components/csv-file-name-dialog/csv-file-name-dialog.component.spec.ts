import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvFileNameDialogComponent } from './csv-file-name-dialog.component';

describe('CsvFileNameDialogComponent', () => {
  let component: CsvFileNameDialogComponent;
  let fixture: ComponentFixture<CsvFileNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvFileNameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvFileNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
