import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'src/app/notifier.service';
import { LoadingService } from 'src/app/shared/components/loading-service.service';
import { DialogPopupComponent } from 'src/app/shared/dialog-popup/dialog-popup.component';
import { FileMappingService } from '../../administration/file-mapping/file-mapping.service';
import { MappingViewService } from './mapping-view.service';

@Component({
  selector: 'app-mapping-view-data',
  templateUrl: './mapping-view-data.component.html',
  styleUrls: ['./mapping-view-data.component.css'],
})
export class MappingViewDataComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'tpaId',
    'sourceDatabase',
    'sourceTable',
    'sourceColumn',
    'targetDatabase',
    'targetTable',
    'targetColumn',
    // 'transformationLogic',
    'actions',
  ];
  mappingForm!: FormGroup;
  editMode: boolean = false;
  editDataId: any;
  filterData: any;
  gridData = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  tableList!: any;
  openForm: boolean = false;
  filterTable: any;
  constructor(
    private readonly fileMappingService: MappingViewService,
    private readonly formBuilder: FormBuilder,
    private readonly notifierService: NotifierService,
    private readonly loadingService: LoadingService,
    private readonly renderer: Renderer2,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filterData = {
      filterColumnNames: this.displayedColumns.map((ele: any) => ({
        Key: ele,
        Value: '',
      })),
      gridData: this.gridData,
      dataSource: this.dataSource,
      paginator: this.paginator,
      sort: this.sort,
    };
    this.mappingForm = this.formBuilder.group({
      sourceColumn: [null, Validators.required],
      sourceDatabase: [null, Validators.required],
      sourceTable: [null, Validators.required],
      targetColumn: [null, Validators.required],
      targetDatabase: [null, Validators.required],
      targetTable: [null, Validators.required],
      transformationLogic: [null],
    });
    this.getTableNames();
  }

  filterTables(value: string): void {
    const filterValue = value.toLowerCase();
    this.filterTable = this.tableList?.filter((value: any) =>
      value.toLowerCase().startsWith(filterValue)
    );
  }

  updatePagination() {
    this.filterData.dataSource.paginator = this.paginator;
  }

  getTableData() {
    this.fileMappingService.getTableData().subscribe(
      (response) => {
        const tableData: any = [];
        for (let i = 0; i < response.length; i++) {
          response[i].sno = i + 1;
          tableData.push(response[i]);
        }
        this.filterData.gridData = tableData;
        this.dataSource = new MatTableDataSource(tableData);
        this.filterData.dataSource = this.dataSource;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filterData.sort = this.sort;
        for (let col of this.filterData.filterColumnNames) {
          col.Value = '';
        }
        this.loadingService.hide();
      },
      (error: any) => {
        this.loadingService.hide();
      }
    );
  }

  getTableNames() {
    this.loadingService.show();
    this.fileMappingService.getTableName().subscribe(
      (response) => {
        this.tableList = response;
        this.getTableData();
      },
      (error: any) => {
        this.loadingService.hide();
      }
    );
  }

  onAddForm() {
    this.openForm = true;
  }

  onCloseForm() {
    this.openForm = false;
    this.editDataId = null;
    this.editMode = false;
    this.mappingForm.reset();
  }

  onFomSubmit() {
    if (this.mappingForm.invalid) {
      return this.mappingForm.markAllAsTouched();
    }
    const {
      sourceColumn,
      sourceDatabase,
      sourceTable,
      targetColumn,
      targetDatabase,
      targetTable,
      tpa_id,
      transformationLogic,
    } = this.mappingForm.value;

    const body = {
      sourceColumn,
      sourceDatabase,
      sourceTable,
      targetColumn,
      targetDatabase,
      targetTable,
      tpa_id,
      transformationLogic,
    };
    this.loadingService.show();

    if (this.editMode && this.editDataId) {
      // updating
      return this.fileMappingService
        .updateMappingData(this.editDataId, body)
        .subscribe(
          (response: any) => {
            this.getTableData();
            this.onCloseForm();
          },
          (error: any) => {
            this.loadingService.hide();

            this.notifierService.showNotification(
              'Error',
              error.error.Message || 'Internal Server error'
            );
          }
        );
    }
    // adding
    return this.fileMappingService.postMappingData(body).subscribe(
      (response: any) => {
        this.getTableData();
        this.mappingForm.reset();
      },
      (error: any) => {
        this.loadingService.hide();
        this.notifierService.showNotification(
          'Error',
          error.error.Message || 'Internal Server error'
        );
      }
    );
  }

  onEditOpen(element: any) {
    const {
      sourceColumn,
      sourceDatabase,
      sourceTable,
      targetColumn,
      targetDatabase,
      targetTable,
      tpa_id,
      transformationLogic,
    } = element;
    this.editDataId = element.mappingId;
    this.editMode = true;
    this.openForm = true;
    this.mappingForm.patchValue({
      sourceColumn,
      sourceDatabase,
      sourceTable,
      targetColumn,
      targetDatabase,
      targetTable,
      tpa_id,
      transformationLogic,
    });
  }

  onDeleteOpen(element: any) {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this data?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteData(element); // Call the deletion logic
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  deleteData(element: any) {
    this.loadingService.show();
    this.fileMappingService.deleteMappingData(element.mappingId).subscribe(
      (response) => {
        if (response) {
          this.notifierService.showNotification(
            'Success',
            response.statusDescription
          );
          this.getTableData();
        }
      },
      (error: any) => {
        this.loadingService.show();
        this.notifierService.showNotification(
          'Error',
          error.error.message || 'Internal Server Error'
        );
      }
    );
  }
}
