import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
    providedIn: 'root',
})
export class FileUploadService extends BaseHttp {
    fileUploadDetails = "uploaData"

    uploadToAPI(formData: FormData) {
        return this.post<any>(this.fileUploadDetails, formData)
    }
}