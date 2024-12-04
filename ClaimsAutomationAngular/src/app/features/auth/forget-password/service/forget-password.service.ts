import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
    providedIn: 'root',
})
export class ForgetPasswordService extends BaseHttp {
    generateOTPUrl: string = 'register/generate_otp';
    resetPasswordUrl: string = 'register/reset_password';

    generateOtp(requestBody: any) {
        return this.login<any>(this.generateOTPUrl, requestBody);
    }

    resetPassword(requestBody: any) {
        return this.login<any>(this.resetPasswordUrl, requestBody);
    }
}