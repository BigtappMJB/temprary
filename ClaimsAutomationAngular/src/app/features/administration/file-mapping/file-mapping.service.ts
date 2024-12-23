import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
  providedIn: 'root',
})
export class FileMappingService extends BaseHttp {
  getTableNameUrl: string = 'um/subModulePermissions?roleId=6&subModuleId=22';
  getTableDataUrl: string = 'api/getAllTemplatesDetails';
  postMappingDataUrl: string = '';
  updateMappingDataUrl: string = '';
  deleteMappingDataUrl: string = '';

  getTableName() {
    return this.get<any>(this.getTableNameUrl);
  }

  getTableData() {
    return this.get<any>(this.getTableDataUrl);
  }

  postMappingData(body: any) {
    return this.post<any>(this.postMappingDataUrl, body);
  }

  updateMappingData(id: any, body: any) {
    return this.put<any>(this.updateMappingDataUrl, body);
  }
  deleteMappingData(body: any) {
    return this.delete<any>(this.deleteMappingDataUrl, body);
  }
}
