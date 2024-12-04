import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { CsvGeneratorService } from './service/csv-generator.service';
import { MyAppHttp } from 'src/app/shared/services/myAppHttp.service';
import { NotifierService } from 'src/app/notifier.service';
import { MatDialog } from '@angular/material/dialog';
import { CsvFileNameDialogComponent } from 'src/app/shared/components/csv-file-name-dialog/csv-file-name-dialog.component';

@Component({
  selector: 'app-csv-generator',
  templateUrl: './csv-generator.component.html',
  styleUrls: ['./csv-generator.component.css']
})
export class CsvGeneratorComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'schedularName', 'startDateTime', 'endDateTime', 'jobStatus', 'duration', 'csvFileCount', 'numberOfCsvFiles', 'numberOfCsvFailed'];
  filterData: any;
  TablesListData: any;
  gridData = [];
  AccessSchedulerList: any;
  schedulerList: any;
  SchedulerForm!: FormGroup;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSize = 10;

  constructor(private csvGenertorService: CsvGeneratorService,
    private formBuilder: FormBuilder,
    public sendReceiveService: SendReceiveService,
    private notifierService: NotifierService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.filterData = {
      filterColumnNames: [
        { "Key": 'sno', "Value": "" },
        { "Key": 'schedularName', "Value": "" },
        { "Key": 'startDateTime', "Value": "" },
        { "Key": 'endDateTime', "Value": "" },
        { "Key": 'jobStatus', "Value": "" },
        { "Key": 'duration', "Value": "" },
        { "Key": 'csvFileCount', "Value": "" },
        { "Key": 'numberOfCsvFiles', "Value": "" },
        { "Key": 'numberOfCsvFailed', "Value": "" }
      ],
      gridData: this.gridData,
      dataSource: this.dataSource,
      paginator: this.paginator,
      sort: this.sort
    };
    this.SchedulerForm = this.formBuilder.group({
      'scheduler': ['', Validators.required]
    });
    this.getCSVGeneratorDetails();
  }
  getCSVGeneratorDetails() {
    this.csvGenertorService.getCSVGeneratorDetails().subscribe(response => {
      const TablesListData: any = [];
      for (let i = 0; i < response.length; i++) {
        response[i].sno = i + 1;
        TablesListData.push(response[i]);
      }
      this.filterData.gridData = TablesListData;
      this.dataSource = new MatTableDataSource(TablesListData);
      this.filterData.dataSource = this.dataSource;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterData.sort = this.sort;
      for (let col of this.filterData.filterColumnNames) {
        col.Value = '';
      }
    });
  }

  updatePagination() {
    this.filterData.dataSource.paginator = this.paginator;
  }

  getTablesList() {
    this.csvGenertorService.getAllTables().subscribe((response) => {
      const TablesListData: any = [];
      for (let i = 0; i < response.length; i++) {
        response[i].sno = i + 1;
        response[i].editMode = false;
        response[i].schedulerName = this.getschedulerName(response[i].schedulerNumber);
        TablesListData.push(response[i]);
      }
      this.TablesListData = TablesListData;
      this.filterData.gridData = TablesListData;
      this.dataSource = new MatTableDataSource(TablesListData);
      this.filterData.dataSource = this.dataSource;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterData.sort = this.sort;
      for (let col of this.filterData.filterColumnNames) {
        col.Value = '';
      }
    })
  }

  getFiles(el: any, status: any) {
    console.log(el);

    this.csvGenertorService.getFileNamesBySchedulerId(el.id).subscribe(response => {
      console.log(response);
      let currentList = [];
      if (status == 1) {
        currentList = response.filter((item: { status: number; }) => item.status === 1);
      } else {
        currentList = response.filter((item: { status: number; }) => item.status === 0);
      }
      const dialogRef = this.dialog.open(CsvFileNameDialogComponent, {
        data: currentList
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    })
  }

  getSchedulerList() {
    this.csvGenertorService.getSchedularList().subscribe((response) => {
      this.schedulerList = response;
      this.getTablesList();
    });
  }
  getschedulerName(id: any) {
    for (let element of this.schedulerList) {
      if (element.schedulerId == id) { return element.schedulerType; }
    }
  }
  editSave(tableDetails: any) {
    this.TablesListData.forEach((element: any) => {
      if (element.tableId == tableDetails.tableId) {
        element.editMode = true;
        this.SchedulerForm.controls['scheduler'].setValue(tableDetails.schedulerNumber);
      }
      else
        element.editMode = false;
    });
  }
  saveBatch(tableDetails: any) {
    let obj = {
      "tableId": tableDetails.tableId,
      "tableName": tableDetails.tableName,
      "schedulerNumber": this.SchedulerForm.value.scheduler
    }
    this.csvGenertorService.saveTableDetails(obj).subscribe(response => {
      this.getTablesList();
      this.notifierService.showNotification('Success', MyAppHttp.ToasterMessage.templateSuccess);
    })
  }

  cronExpression: string = '';
  message: string = '';

  submitCronExpression() {
    if (this.validateCronExpression(this.cronExpression)) {
      this.message = `Cron expression "${this.cronExpression}" is valid and submitted!`;
      // Here, you can call your API to save the cron expression
      console.log(this.cronExpression); // Replace with API call
    } else {
      this.message = `Invalid cron expression: "${this.cronExpression}". Please check.`;
    }
  }

  validateCronExpression(cron: string): boolean {
    // Basic validation for cron expression length (more robust validation can be added)
    const parts = cron.split(' ');
    return parts.length === 6; // Assuming Quartz format (seconds included)
  }








}


