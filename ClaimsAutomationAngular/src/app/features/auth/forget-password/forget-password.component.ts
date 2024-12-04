import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { MyAppHttp } from 'src/app/shared/services/myAppHttp.service';
import { ForgetPasswordService } from './service/forget-password.service';
import { MustMatch } from 'src/app/core/services/must-match.validator';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

    forgetPasswordForm!: FormGroup;
    EmailForm!: FormGroup;
    errorFlag: boolean = false;
    authorizationMessage: any;
    show_password: boolean = false;
    show_eye: boolean = false;
    Newshow_password: boolean = false;
    Newshow_eye: boolean = false;
    Confirmshow_password: boolean = false;
    Confirmshow_eye: boolean = false;
    validation_messages = {
        verificationCode: [
            { type: 'required', message: 'Please enter verification code' }
        ],
        newpassword: [
            { type: 'required', message: 'Please Enter New Password' },
            { type: 'pattern', message: 'Password should contain at least one uppercase letter, one lowercase letter, one number and one special character' },
            { type: 'maxlength', message: 'Password should be maximum 20 characters.' },
            { type: 'minlength', message: 'Password should be minimum 12 characters.' },

        ],
        confirmpassword: [
            { type: 'required', message: 'Please Enter Confirm Password' },
            { type: 'pattern', message: 'Please enter valid Password' },

        ],
        email_id: [
            { type: 'required', message: 'Please Enter Email' },
            { type: 'pattern', message: 'Please enter valid Email ID' },
            { type: 'maxlength', message: 'Password should be maximum 50 characters.' }
        ]
    };
    isEmailEntered: boolean = false;

    constructor(private fb: FormBuilder,
        private router: Router,
        private forgetPasswordService: ForgetPasswordService,
    ) { }

    ngOnInit(): void {
        this.EmailForm = this.fb.group({
            email: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(
                    /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
                ),
            ])],

        });
        this.forgetPasswordForm = this.fb.group({
            verificationCode: ['', Validators.required],
            newpassword: [null, Validators.compose([Validators.required, Validators.minLength(12), Validators.pattern(MyAppHttp.passwordValidation)])],
            confirmpassword: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],

        }, { validator: MustMatch('newpassword', 'confirmpassword') })
    }

    onSubmit() {


        let requestBody = {
            "email": this.EmailForm.value.email,
            "otp": this.forgetPasswordForm.value.verificationCode,
            "new_password": btoa(this.forgetPasswordForm.value.newpassword)
        }
        this.forgetPasswordService.resetPassword(requestBody).subscribe((response) => {
            this.router.navigateByUrl("/");
        })
    }

    onClear() {
        this.forgetPasswordForm.reset();
    }

    onKeyPress(event: any) {
        const pattern = /[\d]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    NewPassword() {
        this.Newshow_password = !this.Newshow_password;
        this.Newshow_eye = !this.Newshow_eye;
    }

    ConfirmPassword() {
        this.Confirmshow_password = !this.Confirmshow_password;
        this.Confirmshow_eye = !this.Confirmshow_eye
    }

    onSubmitGetOTP() {
        let requestBody = {
            "email": this.EmailForm.value.email
        }
        this.forgetPasswordService.generateOtp(requestBody).subscribe((response) => {
            this.isEmailEntered = true;
        })
    }

}
