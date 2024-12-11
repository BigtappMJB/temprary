import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
  providedIn: 'root',
})
export class MappingUploadService extends BaseHttp {
  fileUploadDetails = 'uploadMapping';

  uploadToAPI(formData: FormData) {
    return this.filePostPython<any>(this.fileUploadDetails, formData);
  }
}
