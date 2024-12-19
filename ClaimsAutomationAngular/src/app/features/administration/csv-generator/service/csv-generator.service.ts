import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
  providedIn: 'root',
})
export class CsvGeneratorService extends BaseHttp {
  getAllTablesListdUrl: string = 'um/getAllCsvTables';
  getSchedulerListUrl: string = 'um/getSchedulerMaster';
  SaveTableDetails: string = 'um/updateSchedulerMaster';

  getCSVGeneratorUrl: string = 'api/scheduler/GetAllSchedulerLog';
  fileNamesBySchedulerIdUrl: string = 'api/scheduler/scheduler-file-details/';
  getSchedulerRecordsUrl: string = 'api/scheduler/scheduler-file-details/';

  getSchedulerLogUrl = 'schedulerLog';

  getSchedulerLog() {
    return this.get<any>(this.getSchedulerLogUrl, 'python');
  }
  getAllTables() {
    return this.get<any>(this.getAllTablesListdUrl);
  }

  getSchedulerRecords(id: Number, status: any) {
    return this.get<any>(this.getSchedulerRecordsUrl + id + '/' + status);
  }

  getSchedularList() {
    return this.get<any>(this.getSchedulerListUrl);
  }

  saveTableDetails(tableDetails: any) {
    return this.post<any>(this.SaveTableDetails, tableDetails);
  }

  getCSVGeneratorDetails() {
    return this.get<any>(this.getCSVGeneratorUrl);
  }

  getFileNamesBySchedulerId(id: any) {
    return this.get<any>(this.fileNamesBySchedulerIdUrl + id);
  }
}
