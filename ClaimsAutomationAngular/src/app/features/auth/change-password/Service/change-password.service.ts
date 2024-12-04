import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService extends BaseHttp {
  changePasswordUrl: string = '/changePassword';
  changeDefaultPasswordUrl: string = 'register/change_password';

  changepassword(requestBody: any) {
    return this.post<any>(this.changePasswordUrl, requestBody);
  }
  changeDefaultPassword(requestBody: any) {
    return this.login<any>(this.changeDefaultPasswordUrl, requestBody);
  }
}
