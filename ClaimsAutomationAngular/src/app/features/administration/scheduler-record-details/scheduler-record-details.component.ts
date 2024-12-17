import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvSchedulerService } from '../csv-scheduler/service/csv-scheduler.service';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { exportToCSV } from 'src/app/shared/generals';
import { MatTableDataSource } from '@angular/material/table';
import { CsvGeneratorService } from '../csv-generator/service/csv-generator.service';

@Component({
  selector: 'app-scheduler-record-details',
  templateUrl: './scheduler-record-details.component.html',
  styleUrls: ['./scheduler-record-details.component.css'],
})
export class SchedulerRecordDetailsComponent implements OnInit {
  schedulerDetails: any = {};
  displayedColumns: string[] = ['sno', 'recordId', 'recordName', 'reason'];
  filterData: any;
  TablesListData: any;
  gridData = [];
  pageSize = 10;
  dataSource!: any;
  statusObject: any = {
    0: 'Failed Records',
    1: 'Inserted Records',
    2: 'Total Records',
  };
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  staticData: any = [
    {
      recordId: 163,
      recordName: 'Claims',
      jobStatus: 'success',
      reason: 'Record successfully created',
    },
    {
      recordId: 163,
      recordName: 'Claims',
      jobStatus: 'failure',
      reason: 'Error in storing data',
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private csvGenertorService: CsvGeneratorService
  ) {}

  ngOnInit(): void {
    this.schedulerDetails.id = Number(this.route.snapshot.paramMap.get('id'));
    this.schedulerDetails.name =
      this.route.snapshot.paramMap.get('schedularName');
    //  0- Failure , 1- Success , 2- Total
    this.schedulerDetails.status = this.route.snapshot.paramMap.get('status');
    this.filterData = {
      filterColumnNames: this.displayedColumns.map((ele) => ({
        Key: ele,
        Value: '',
      })),
      gridData: this.gridData,
      dataSource: this.dataSource,
      paginator: this.paginator,
      sort: this.sort,
    };
    this.getCSVGeneratorDetails();
  }

  todayDate = new Date();
  getCSVGeneratorDetails() {
    const TablesListData: any = [];

    for (let i = 0; i < this.staticData.length; i++) {
      this.staticData[i].sno = i + 1;
      TablesListData.push(this.staticData[i]);
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

    // this.csvGenertorService
    //   .getSchedulerRecords(this.schedulerDetails.id, this.schedulerDetails.id)
    //   .subscribe((response: any) => {
    //     for (let i = 0; i < response.length; i++) {
    //       response[i].sno = i + 1;
    //       TablesListData.push(response[i]);
    //     }
    //     this.filterData.gridData = TablesListData;
    //     this.dataSource = new MatTableDataSource(TablesListData);
    //     this.filterData.dataSource = this.dataSource;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.filterData.sort = this.sort;
    //     for (let col of this.filterData.filterColumnNames) {
    //       col.Value = '';
    //     }
    //   });
  }
  onExportCSV() {
    const fileName = `${this.schedulerDetails.name}_${this.statusObject[
      this.schedulerDetails.status
    ]
      .toLowerCase()
      .replace(/ /g, '_')}_${new Date().toISOString()}.csv`;
    if (this.filterData.dataSource.filteredData.length !== 0) {
      exportToCSV(this.filterData.dataSource.filteredData, fileName);
    }
  }
  updatePagination() {
    this.filterData.dataSource.paginator = this.paginator;
  }
}
