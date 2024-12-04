import { Injectable } from '@angular/core';
import { BaseHttp } from 'src/app/core/services/baseHttp.service';

@Injectable({
    providedIn: 'root',
})
export class EmailVerificationService extends BaseHttp {
    signupUrl: string = 'register/verify_otp';

    verifyOtp(requestBody: any) {
        return this.login<any>(this.signupUrl, requestBody);
    }
}