import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-csv-file-name-dialog',
  templateUrl: './csv-file-name-dialog.component.html',
  styleUrls: ['./csv-file-name-dialog.component.css']
})
export class CsvFileNameDialogComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'fileName'];
  filterData: any;
  gridData = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<CsvFileNameDialogComponent>) { }

  ngOnInit(): void {
    this.filterData = {
      filterColumnNames: [
        { "Key": 'sno', "Value": "" },
        { "Key": 'fileName', "Value": "" }
      ],
      gridData: this.gridData,
      dataSource: this.dataSource,
      paginator: this.paginator,
      sort: this.sort
    };
    this.formatGridData();
  }

  formatGridData() {
    const TablesListData: any = [];
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].sno = i + 1;
      TablesListData.push(this.data[i]);
    }
    this.filterData.gridData = TablesListData;
    this.dataSource = new MatTableDataSource(TablesListData);
    this.filterData.dataSource = this.dataSource;
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    for (let col of this.filterData.filterColumnNames) {
      col.Value = '';
    }
  }


  updatePagination() {
    this.filterData.dataSource.paginator = this.paginator;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
