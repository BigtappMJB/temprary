import { Component, OnInit } from '@angular/core';
import { MyAppHttp } from 'src/app/shared/services/myAppHttp.service';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { DatePipe } from '@angular/common';
import { NotifierService } from 'src/app/notifier.service';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from './fileupload.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent implements OnInit {
  selectedFile: File | null = null;
  files: any[] = [];
  isSpinner: boolean = false;
  tableUploadForm!: FormGroup;
  validation_messages = {
    tableId: [{ type: 'required', message: 'Table is required' }],
    file: [
      { type: 'required', message: 'File is required' },
      { type: 'invalidFileType', message: 'Accept only .xlsx and .xls' },
    ],
  };
  responseValue: any = null;
  constructor(
    private formBuilder: FormBuilder,
    public sendReceiveService: SendReceiveService,
    public datepipe: DatePipe,
    private apiService: FileUploadService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.tableUploadForm = this.formBuilder.group({
      // tableId: [null, Validators.compose([Validators.required])],
      file: [
        null,
        Validators.compose([Validators.required, this.fileValidator]),
      ],
    });
  }
  // Custom Validator for file type
  fileValidator(control: any) {
    const allowedExtensions = ['xlsx', 'xls'];
    const file = control.value;
    if (file) {
      const fileExtension = file.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  onFileChange(evt: any) {
    const file = evt.target.files[0];
    this.files = evt.target.files;
    let fileExtension = file.name.split('.').pop();
    if (fileExtension == 'xlsx' || fileExtension == 'xls') {
      this.selectedFile = file;
      console.log(this.selectedFile);
    } else {
      this.files = [];
    }
  }

  ontableUploadSubmit() {
    if (!this.tableUploadForm.valid) {
      Object.values(this.tableUploadForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    console.log('uploading');
    if (!this.selectedFile) {
      alert('Please select a file first!');
      return;
    }
    const formData = new FormData();
    // formData.append('mapping_table', this.tableUploadForm.value.tableId);
    formData.append('file', this.selectedFile);
    console.log('FormData content:', formData);
    this.isSpinner = true;
    this.uploadToAPI(formData).subscribe(
      (response) => {
        this.responseValue = response;
        this.isSpinner = false;
        this.notifierService.showNotification(
          'Success',
          'File uploaded successfully!'
        );
        console.log('File uploaded successfully!', response);
      },
      (error) => {
        this.isSpinner = false;
        console.log(error.error);

        console.error('Error uploading file', error);
        this.notifierService.showNotification(
          'Error',
          error?.error?.error || 'Internal Server Error'
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
