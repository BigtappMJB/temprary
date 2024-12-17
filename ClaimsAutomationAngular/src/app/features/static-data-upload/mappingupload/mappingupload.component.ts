import { Component, OnInit } from '@angular/core';
import { MyAppHttp } from 'src/app/shared/services/myAppHttp.service';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { DatePipe } from '@angular/common';
import { NotifierService } from 'src/app/notifier.service';

import { HttpClient } from '@angular/common/http';
import { MappingUploadService } from './mappingupload.service';
@Component({
  selector: 'app-mappingupload',
  templateUrl: './mappingupload.component.html',
  styleUrls: ['./mappingupload.component.css'],
})
export class MappinguploadComponent implements OnInit {
  selectedFile: File | null = null;
  files: any[] = [];
  isSpinner: boolean = false;
  errors: any = null;
  constructor(
    private http: HttpClient,
    public sendReceiveService: SendReceiveService,
    public datepipe: DatePipe,
    private notifierService: NotifierService,
    private apiService: MappingUploadService
  ) {}

  ngOnInit(): void {}

  onFileChange(evt: any) {
    const file = evt.target.files[0];
    this.errors = null;
    let fileExtension = file.name.split('.').pop();
    if (fileExtension == 'xlsx' || fileExtension == 'xls') {
      this.selectedFile = file;
      this.files = evt.target.files;
    } else {
      this.errors =
        'Invalid file type. Please upload files with XLS/XLSX type only.';
      // this.notifierService.showNotification(
      //   'Error',
      //   MyAppHttp.ToasterMessage.onlyExcel
      // );
    }
  }

  ontableUploadSubmit() {
    console.log('uploading');
    this.errors = null;
    if (!this.selectedFile) {
      this.errors = 'File is mandatory';
      return;
    }
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedMimeTypes.includes(this.selectedFile.type)) {
      this.errors = 'Please upload a valid Excel file (.xls, .xlsx)';
      return;
    }
    this.isSpinner = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.uploadToAPI(formData).subscribe(
      (response) => {
        this.notifierService.showNotification(
          'Success',
          response.message || 'File uploaded successfully!'
        );
        this.files = [];
        console.log('File uploaded successfully!', response);
        this.isSpinner = false;
      },
      (error) => {
        console.error('Error uploading file', error);
        this.isSpinner = false;
        this.notifierService.showNotification(
          'Error',
          error?.error?.error || 'Failed to upload the file'
        );
      }
    );
  }
  uploadToAPI(formData: FormData) {
    return this.apiService.uploadToAPI(formData);
  }
  onCancel() {
    this.files = [];
  }
}
