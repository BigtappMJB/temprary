import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
  providedIn: 'root',
})
export class CsvSchedulerService extends BaseHttp {
  getAllSchedulerUrl: string = 'api/scheduler/GetAllSchedulerDetails';
  getSchedulerUrl: string = 'api/scheduler/schedulerDetails';
  getSetSchedulerUrl: string = 'api/scheduler/Scheduler';
  stopSchedulerUrl: string = 'api/scheduler/stop';
  deleteSchedulerUrl: string = 'api/scheduler/schedulerDetails/';
  updateSchedulerByIdUrl: string = 'api/scheduler/schedulerDetails/';

  processMClaimSettleDetail: string = 'processMClaimSettleDetail';
  processMClaimHealth: string = 'processMClaimHealth';
  processMClaims: string = 'processMClaims';

  defaultSchedulers: string = '';

  getDefaultSchedulers() {
    return this.get<any>(this.defaultSchedulers, 'python');
  }

  postPythonSchedulers(name: string) {
    const apiPath: any = {
      claims: this.processMClaims,
      'claims health': this.processMClaimHealth,
      'claims settle details': this.processMClaimSettleDetail,
    };
    return this.post<any>(
      apiPath[name.trim().toLocaleLowerCase()],
      null,
      'python'
    );
  }

  getProcessMClaimSettleDetail() {
    return this.post<any>(this.processMClaimSettleDetail, null, 'python');
  }
  getProcessMClaimHealth() {
    return this.post<any>(this.processMClaimHealth, null, 'python');
  }

  getProcessMClaims() {
    return this.post<any>(this.processMClaims, null, 'python');
  }

  getAllSchedulerDetails() {
    return this.get<any>(this.getAllSchedulerUrl);
  }

  scheduleTask(requestBody: any) {
    return this.post<any>(this.getSchedulerUrl, requestBody);
  }

  getSetScheduler(requestBody: any) {
    return this.post<any>(this.getSetSchedulerUrl, requestBody);
  }

  stopScheduler(schedularId: any, schedulerName: any) {
    return this.delete<any>(
      this.stopSchedulerUrl +
        '?schedulerId=' +
        schedularId +
        '&schedulerName=' +
        schedulerName
    );
  }

  deleteSchedulerById(id: any) {
    return this.delete<any>(this.deleteSchedulerUrl + id);
  }

  updateSchedulerById(id: any, requestBody: any) {
    return this.put<any>(this.updateSchedulerByIdUrl + id, requestBody);
  }
}
