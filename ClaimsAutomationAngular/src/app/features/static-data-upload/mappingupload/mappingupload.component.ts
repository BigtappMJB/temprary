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
    this.files = evt.target.files;
    let fileExtension = file.name.split('.').pop();
    if (fileExtension == 'xlsx' || fileExtension == 'xls') {
      this.selectedFile = file;
      console.log(this.selectedFile);
    } else {
      this.notifierService.showNotification(
        'Error',
        MyAppHttp.ToasterMessage.onlyExcel
      );
    }
  }

  ontableUploadSubmit() {
    console.log('uploading');
    if (!this.selectedFile) {
      alert('Please select a file first!');
      return;
    }
    this.isSpinner = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    console.log('FormData content:', formData);
    console.log(formData.get('file') as File);
    this.uploadToAPI(formData).subscribe(
      (response) => {
        this.notifierService.showNotification(
          'Success',
          'File uploaded successfully!'
        );
        this.files = [];
        console.log('File uploaded successfully!', response);
        this.isSpinner = false;
      },
      (error) => {
        console.error('Error uploading file', error);
        this.isSpinner = false;
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
