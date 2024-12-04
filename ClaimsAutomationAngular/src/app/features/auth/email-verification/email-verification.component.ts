import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailVerificationService } from './service/email-verification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  verifyOTPForm!: FormGroup;
  validation_messages = {
    verificationCode: [
      { type: 'required', message: 'Please enter verification code' }
    ]
  };
  errorFlag: boolean = false;
  authorizationMessage: any;


  constructor(private fb: FormBuilder, 
              private emailVerificationService: EmailVerificationService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.verifyOTPForm = this.fb.group({
      verificationCode: ['', Validators.required]
    })
  }

  onSubmit() {

    console.log('Verification code submitted:', this.verifyOTPForm.value.verificationCode);
    let mail = localStorage.getItem("signupMail")
    let requestBody={
      "email":mail?mail:"",
      "otp": this.verifyOTPForm.value.verificationCode
  }
    this.emailVerificationService.verifyOtp(requestBody).subscribe((response)=>{
      console.log(response);
      this.router.navigateByUrl("/")
    }, (error) => {
      this.errorFlag = true;
      this.authorizationMessage = error.error.error;
    })
  }

  onClear() {
    this.verifyOTPForm.reset();
  }

  onKeyPress(event: any) {
    const pattern = /[\d]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
