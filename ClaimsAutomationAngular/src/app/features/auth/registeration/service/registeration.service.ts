import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
    providedIn: 'root',
})
export class RegisterationService extends BaseHttp {
    signupUrl: string = 'register/registration';

    postRegisterationDetails(requestBody: any) {
        return this.login<any>(this.signupUrl, requestBody);
    }
}