import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CsvSchedulerService } from './service/csv-scheduler.service';
import { MatSelectChange } from '@angular/material/select';
import { NotifierService } from 'src/app/notifier.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopupComponent } from 'src/app/shared/dialog-popup/dialog-popup.component';
import { parseCronExpression } from 'src/app/shared/generals';

@Component({
  selector: 'app-csv-scheduler',
  templateUrl: './csv-scheduler.component.html',
  styleUrls: ['./csv-scheduler.component.css'],
})
export class CsvSchedulerComponent {
  csvSchedulerForm!: FormGroup;
  hours = Array.from({ length: 12 }, (_, i) => i + 1); // Hours: 1-12
  minutes = Array.from({ length: 60 }, (_, i) => i); // Minutes: 0-59
  days = Array.from({ length: 31 }, (_, i) => i + 1); // Minutes: 0-59
  displayedColumns: string[] = [
    'sno',
    'schedulerName',
    'startDate',
    'startTime',
    'endDate',
    'endTime',
    'actions',
  ];
  neverEnd = false;
  filterData: any;
  gridData = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  isAddSchedulerForm: boolean = false;
  isDaily: boolean = false;
  isWeekly: boolean = false;
  isMonthly: boolean = false;
  isYearly: boolean = false;
  dayList: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  dayNumMap: { [key: string]: string } = {
    Monday: 'MON',
    Tuesday: 'TUE',
    Wednesday: 'WED',
    Thursday: 'THU',
    Friday: 'FRI',
    Saturday: 'SAT',
    Sunday: 'SUN',
  };
  MonthOptions = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];

  daysOfWeek = [
    { name: 'Monday', checked: false, value: 'MON' },
    { name: 'Tuesday', checked: false, value: 'TUE' },
    { name: 'Wednesday', checked: false, value: 'WED' },
    { name: 'Thursday', checked: false, value: 'THU' },
    { name: 'Friday', checked: false, value: 'FRI' },
    { name: 'Saturday', checked: false, value: 'SAT' },
    { name: 'Sunday', checked: false, value: 'SUN' },
  ];
  RequestBodystartMinute: any;
  RequestBodyAdjustedHour: any;
  editMode: any;
  editedUserSchedulerId: any;

  schedulerData: any = [];

  constructor(
    private fb: FormBuilder,
    private csvSchedulerService: CsvSchedulerService,
    private notifierService: NotifierService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterData = {
      filterColumnNames: [
        { Key: 'sno', Value: '' },
        { Key: 'schedulerName', Value: '' },
        { Key: 'startDate', Value: '' },
        { Key: 'startTime', Value: '' },
        { Key: 'endDate', Value: '' },
      ],
      gridData: this.gridData,
      dataSource: this.dataSource,
      paginator: this.paginator,
      sort: this.sort,
    };
    this.csvSchedulerForm = this.fb.group({
      schedulerName: [null, Validators.required],
      startDate: [null, Validators.required],
      startHour: [null, Validators.required],
      startMinute: [null, Validators.required],
      startAmPm: [null, Validators.required],
      endDate: [null, Validators.required],
      neverEnd: [false],
      repeatUnit: [null, Validators.required],
      selectedWeekDay: [null, Validators.required],
      repeatDayOfMonth: [null, Validators.required],
      repeatMonthYear: [null, Validators.required],
      repeatDayOfMonthyear: [null, Validators.required],
    });

    // Update form validators when 'neverEnd' changes
    this.csvSchedulerForm.get('startDate')?.valueChanges.subscribe((value) => {
      this.updateEndDateValidators();
    });

    // Update form validators when 'neverEnd' changes
    this.csvSchedulerForm.get('neverEnd')?.valueChanges.subscribe((value) => {
      this.neverEnd = value;
      this.updateEndDateValidators();
    });

    this.getSchedulerList();
    this.handleConditionalValidators();
  }

  handleConditionalValidators(): void {
    this.csvSchedulerForm.get('repeatUnit')?.valueChanges.subscribe((value) => {
      this.csvSchedulerForm.get('selectedWeekDay')?.clearValidators();
      this.csvSchedulerForm.get('repeatDayOfMonth')?.clearValidators();
      this.csvSchedulerForm.get('repeatMonthYear')?.clearValidators();
      this.csvSchedulerForm.get('repeatDayOfMonthyear')?.clearValidators();

      if (value === 'Weekly') {
        // Make selectedWeekDay required
        this.csvSchedulerForm
          .get('selectedWeekDay')
          ?.setValidators(Validators.required);
      }
      if (value === 'Monthly') {
        this.csvSchedulerForm
          .get('repeatDayOfMonth')
          ?.setValidators(Validators.required);
      }

      if (value === '') {
        this.csvSchedulerForm
          .get('repeatMonthYear')
          ?.setValidators(Validators.required);
        this.csvSchedulerForm
          .get('repeatDayOfMonthyear')
          ?.setValidators(Validators.required);
      }
      this.csvSchedulerForm.get('selectedWeekDay')?.updateValueAndValidity();
      this.csvSchedulerForm.get('repeatDayOfMonth')?.updateValueAndValidity();
      this.csvSchedulerForm.get('repeatMonthYear')?.updateValueAndValidity();
      this.csvSchedulerForm
        .get('repeatDayOfMonthyear')
        ?.updateValueAndValidity();
    });
  }
  // Custom Validator to prevent past dates
  notPastDate() {
    return (control: any) => {
      const today = new Date();
      if (control.value && new Date(control.value) < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  // Update the 'endDate' validator based on 'neverEnd'
  updateEndDateValidators() {
    if (this.neverEnd) {
      // When 'neverEnd' is true, make endDate optional
      this.csvSchedulerForm.get('endDate')?.clearValidators();
    } else {
      // When 'neverEnd' is false, ensure endDate is greater than startDate
      this.csvSchedulerForm
        .get('endDate')
        ?.setValidators([
          Validators.required,
          this.endDateGreaterThanStartDate(),
        ]);
    }
    this.csvSchedulerForm.get('endDate')?.updateValueAndValidity();
  }

  // Custom Validator to ensure endDate is greater than startDate
  endDateGreaterThanStartDate() {
    return (control: any) => {
      const startDate = this.csvSchedulerForm.get('startDate')?.value;
      if (
        startDate &&
        control.value &&
        new Date(control.value) <= new Date(startDate)
      ) {
        return { endDateBeforeStartDate: true };
      }
      return null;
    };
  }

  getSchedulerList() {
    this.csvSchedulerService.getAllSchedulerDetails().subscribe((response) => {
      this.schedulerData = [];
      for (let i = 0; i < response.length; i++) {
        response[i].sno = i + 1;
        this.schedulerData.push(response[i]);
      }
      this.filterData.gridData = this.schedulerData;
      this.dataSource = new MatTableDataSource(this.schedulerData);
      this.filterData.dataSource = this.dataSource;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterData.sort = this.sort;
      for (let col of this.filterData.filterColumnNames) {
        col.Value = '';
      }
    });
  }

  onAddscheduler() {
    this.isAddSchedulerForm = true;
    this.editMode = false;
    this.editedUserSchedulerId = null
    this.csvSchedulerForm.reset();
  }

  onActivatescheduler(element: any, event: any) {
    if (event.checked) {
      const requestBody = {
        schedulerId: element.id,
        schedulerName: element.schedularName,
        startDateTime: element.startDateTime,
        endDateTime: element.endDateTime,
        cronExpression: element.cronExpression,
        status: '1',
      };
      this.csvSchedulerService
        .getSetScheduler(requestBody)
        .subscribe((response) => {
          if (response) {
            this.notifierService.showNotification(
              'Success',
              response.statusDescription
            );
            this.getSchedulerList();
          }
        });
    } else {
      this.csvSchedulerService
        .stopScheduler(element.id, element.schedularName)
        .subscribe((response) => {
          this.getSchedulerList();
          this.notifierService.showNotification(
            'Success',
            response.statusDescription
          );
        });
    }
  }

  onEditScheduler(element: any) {
    this.editedUserSchedulerId = element.id;
    this.isAddSchedulerForm = true;
    const {
      startMinute,
      startHour,
      startAmPm,
      type,
      repeatDayOfMonthyear,
      repeatMonthYear,
      dayOfMonth,
      dayOfWeek,
    } = parseCronExpression(element.cronExpression);
    this.isDaily = type === 'Daily';
    this.isWeekly = type === 'Weekly';
    this.isMonthly = type === 'Monthly';
    this.isYearly = type === 'Yearly';
    this.csvSchedulerForm.patchValue({
      schedulerName: element.schedularName,
      startDate: element.startDateTime,
      startHour: startHour,
      startMinute: parseInt(startMinute),
      startAmPm: startAmPm,
      endDate: element.endDateTime,
      neverEnd: element.endDateTime == null ? true : false,
      repeatUnit: type,
      selectedWeekDay: dayOfWeek,
      repeatDayOfMonth: parseInt(dayOfMonth),
      repeatMonthYear: parseInt(repeatMonthYear),
      repeatDayOfMonthyear: parseInt(repeatDayOfMonthyear),
    });
    this.editMode = true;
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
    this.csvSchedulerService
      .deleteSchedulerById(element.id)
      .subscribe((response) => {
        if (response) {
          this.notifierService.showNotification(
            'Success',
            response.statusDescription
          );
          this.getSchedulerList();
        }
      });
  }

  onOccuranceChange(event: MatSelectChange): void {
    this.isDaily = event.value === 'Daily';
    this.isWeekly = event.value === 'Weekly';
    this.isMonthly = event.value === 'Monthly';
    this.isYearly = event.value === 'Yearly';
  }

  onConfirm() {
    console.log(this.csvSchedulerForm.invalid);

    if (this.csvSchedulerForm.invalid) {
      Object.keys(this.csvSchedulerForm.controls).forEach((key) => {
        const control = this.csvSchedulerForm.get(key);

        console.log(`Control: ${key}`);
        console.log('Value:', control?.value);
        console.log('Valid:', control?.valid);
        console.log('Errors:', control?.errors);
        console.log('Touched:', control?.touched);
      });

      return this.csvSchedulerForm.markAllAsTouched();
    }
    const cronExpression = this.generateCronExpression();
    let startDateTime = new Date(this.csvSchedulerForm.get('startDate')?.value);
    startDateTime.setHours(
      this.RequestBodyAdjustedHour,
      this.RequestBodystartMinute
    );
    let endDateTime = new Date(this.csvSchedulerForm.get('endDate')?.value);
    endDateTime.setHours(12, 0);
    const cronData = {
      schedularName: this.csvSchedulerForm.get('schedulerName')?.value,
      startDateTime: startDateTime,
      endDateTime: this.csvSchedulerForm.get('neverEnd')?.value
        ? null
        : endDateTime
        ? endDateTime
        : null,
      cronExpression: cronExpression,
      status: '0',
    };
    if (this.editMode) {
      this.csvSchedulerService
        .updateSchedulerById(this.editedUserSchedulerId, cronData)
        .subscribe((response) => {
          this.isAddSchedulerForm = false;
          this.getSchedulerList();
          this.editMode = false;
          this.csvSchedulerForm.reset();
          this.notifierService.showNotification(
            'Success',
            response?.statusDescription
          );
        });
    } else {
      this.csvSchedulerService.scheduleTask(cronData).subscribe((response) => {
        this.isAddSchedulerForm = false;
        this.getSchedulerList();
        this.csvSchedulerForm.reset();
      });
    }
  }

  generateCronExpression(): string {
    const startHour = this.csvSchedulerForm.get('startHour')?.value;
    const startMinute = this.csvSchedulerForm.get('startMinute')?.value;
    const startAmPm = this.csvSchedulerForm.get('startAmPm')?.value;
    const adjustedHour =
      startAmPm === 'PM' && startHour !== 12
        ? startHour + 12
        : startAmPm === 'AM' && startHour === 12
        ? 0
        : startHour;
    this.RequestBodystartMinute = startMinute;
    this.RequestBodyAdjustedHour = adjustedHour;
    let cronExpression = '';
    if (this.isDaily) {
      cronExpression = `0 ${startMinute} ${adjustedHour} * * ?`;
    } else if (this.isWeekly) {
      const selectedWeekDay =
        this.csvSchedulerForm.get('selectedWeekDay')?.value;
      cronExpression = `0 ${startMinute} ${adjustedHour} ? * ${selectedWeekDay}`;
    } else if (this.isMonthly) {
      const dayOfMonth = this.csvSchedulerForm.get('repeatDayOfMonth')?.value;
      cronExpression = `0 ${startMinute} ${adjustedHour} ${dayOfMonth} * ?`;
    } else if (this.isYearly) {
      const dayOfMonth = this.csvSchedulerForm.get(
        'repeatDayOfMonthyear'
      )?.value;
      const month = this.csvSchedulerForm.get('repeatMonthYear')?.value;
      cronExpression = `0 ${startMinute} ${adjustedHour} ${dayOfMonth} ${month} ? *`;
    }
    return cronExpression;
  }

  onStartScheduler(element: any) {
    element.isSchedulerRunning = true;
    this.csvSchedulerService
      .postPythonSchedulers(element.schedularName)
      .subscribe(
        (response) => {
          this.notifierService.showNotification('Success', response.message);

          element.isSchedulerRunning = false;
        },
        (error) => {
          console.error(error);
          this.notifierService.showNotification('Error', error.message);
          element.isSchedulerRunning = false;
        }
      );
  }

  onCancel() {
    this.isAddSchedulerForm = false;
  }
}
