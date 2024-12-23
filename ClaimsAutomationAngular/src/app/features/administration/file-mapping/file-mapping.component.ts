import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'src/app/notifier.service';
import { FileMappingService } from './file-mapping.service';
import { LoadingService } from 'src/app/shared/components/loading-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopupComponent } from 'src/app/shared/dialog-popup/dialog-popup.component';

@Component({
  selector: 'app-file-mapping',
  templateUrl: './file-mapping.component.html',
  styleUrls: ['./file-mapping.component.css'],
})
export class FileMappingComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'tableName', 'templateName', 'actions'];
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
    private readonly fileMappingService: FileMappingService,
    private readonly formBuilder: FormBuilder,
    private readonly notifierService: NotifierService,
    private readonly loadingService: LoadingService,
    private readonly renderer: Renderer2,
    private readonly dialog: MatDialog
  ) {}

  validTableNameValidator(validOptions: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(control.value);
      if (!control.value) {
        return null; // If the control is empty, let the "required" validator handle it.
      }
      const isValid = this.tableList?.some(
        (option: any) => option.tableName === control.value?.tableName
      );
      console.log({ isValid });

      return isValid ? null : { invalidTableName: true };
    };
  }
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
      tableName: [
        '',
        Validators.compose([
          Validators.required,
          this.validTableNameValidator(this.tableList),
        ]),
      ],
      fileName: [null, Validators.required],
    });

    this.mappingForm.get('tableName')?.valueChanges.subscribe((value) => {
      if (typeof value === 'string') this.filterTables(value || '');
    });
    this.getTableNames();
  }

  filterTables(value: string): void {
    const filterValue = value.toLowerCase();
    this.filterTable = this.tableList?.filter((value: any) =>
      value.tableName.toLowerCase().startsWith(filterValue)
    );
  }
  // Function to display the table name in the input field
  displayTableName(table: any): string {
    return table ? table.tableName : '';
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

  onCheckStatus(event: any) {
    if (event.checked) {
      this.mappingForm.controls['status'].setValue('Y');
    } else {
      this.mappingForm.controls['status'].setValue('N');
    }
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
    const { tableName, fileName } = this.mappingForm.value;

    const body = { tableName, fileName };
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
  assignTableNameToForm(tableId: number) {
    return this.tableList.find((ele: any) => ele.tableId === tableId);
  }

  onEditOpen(element: any) {
    const {} = element;
    this.editDataId = element.templateId;
    this.editMode = true;
    this.openForm = true;
    this.mappingForm.patchValue({
      tableName: this.assignTableNameToForm(element.tableId),
      fileName: element.templateName,
    });
  }

  onSchedulerDelete(element: any) {
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
    this.fileMappingService.deleteMappingData(element.templateId).subscribe(
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
