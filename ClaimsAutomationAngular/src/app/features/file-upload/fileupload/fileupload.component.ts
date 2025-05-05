import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyAppHttp } from 'src/app/shared/services/myAppHttp.service';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { DatePipe } from '@angular/common';
import { NotifierService } from 'src/app/notifier.service';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from './fileupload.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/shared/components/loading-service.service';
import { Router } from '@angular/router';
import { FileUploadNavigationService } from 'src/app/shared/services/file-upload-navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent implements OnInit, OnDestroy {
  selectedFile: any = null;
  files: any[] = [];
  isSpinner: boolean = false;
  tableUploadForm!: FormGroup;
  inputSubModuleId: number = 19; // Default to CAD subModuleId
  private subscription: Subscription = new Subscription();
  validation_messages = {
    tableId: [{ type: 'required', message: 'Table is required' }],
    file: [
      { type: 'required', message: 'File is required' },
      { type: 'invalidFileType', message: 'Accept only .xlsx and .xls' },
    ],
  };
  responseValue: any = null;
  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly sendReceiveService: SendReceiveService,
    public readonly datepipe: DatePipe,
    private readonly apiService: FileUploadService,
    private readonly notifierService: NotifierService,
    private readonly loadingService: LoadingService,
    private readonly router: Router,
    private readonly fileUploadNavigationService: FileUploadNavigationService
  ) {}

  ngOnInit(): void {
    // Subscribe to the navigation service to get the current subModuleId
    this.subscription.add(
      this.fileUploadNavigationService.currentSubModuleId$.subscribe(id => {
        console.log('Received subModuleId from service:', id);
        this.inputSubModuleId = id;
      })
    );
    
    // Check if we're navigating to scheduler
    const navigatingToScheduler = localStorage.getItem('navigatingToScheduler');
    if (navigatingToScheduler === 'true') {
      console.log('Detected navigation to scheduler, redirecting...');
      localStorage.removeItem('navigatingToScheduler');
      this.router.navigateByUrl('administration/schedulerDetails');
      return; // Exit early to prevent further initialization
    }
    
    // Also check localStorage as a fallback
    const fromMenu = localStorage.getItem('selectedSubModuleId');
    console.log('Retrieved selectedSubModuleId from localStorage:', fromMenu);
    
    if (fromMenu) {
      const menuId = parseInt(fromMenu, 10);
      this.inputSubModuleId = menuId;
      console.log('FileuploadComponent initialized with subModuleId:', this.inputSubModuleId);
    }
    
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
    let fileExtension = file.name.split('.').pop();
    if (fileExtension == 'xlsx' || fileExtension == 'xls') {
      this.selectedFile = file;
      this.files = evt.target.files;
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

    const formData = new FormData();
    // formData.append('mapping_table', this.tableUploadForm.value.tableId);
    formData.append('file', this.selectedFile);
    console.log('FormData content:', formData);
    this.isSpinner = true;
    this.loadingService.show();
    this.uploadToAPI(formData).subscribe(
      (response) => {
        this.responseValue = response;
        this.isSpinner = false;
        this.loadingService.hide();

        this.notifierService.showNotification(
          'Success',
          'File uploaded successfully!'
        );
        console.log('File uploaded successfully!', response);
      },
      (error) => {
        this.isSpinner = false;
        console.log(error.error);
        this.loadingService.hide();

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
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }
}
