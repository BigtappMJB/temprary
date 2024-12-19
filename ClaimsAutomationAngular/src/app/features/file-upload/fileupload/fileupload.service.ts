import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService extends BaseHttp {
  fileUploadDetails = 'uploadVidalClaims';

  uploadToAPI(formData: FormData) {
    return this.filePostPython<any>(this.fileUploadDetails, formData);
  }
}
