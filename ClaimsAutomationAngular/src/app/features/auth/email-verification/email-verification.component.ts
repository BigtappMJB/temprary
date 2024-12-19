import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailVerificationService } from './service/email-verification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css'],
})
export class EmailVerificationComponent implements OnInit {
  @ViewChild('verificationCode') verificationCode!: ElementRef;

  verifyOTPForm!: FormGroup;
  validation_messages = {
    verificationCode: [
      { type: 'required', message: 'Please enter verification code' },
    ],
  };
  errorFlag: boolean = false;
  authorizationMessage: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly router: Router,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.verifyOTPForm = this.fb.group({
      verificationCode: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    if (this.verificationCode) {
      this.renderer.selectRootElement(this.verificationCode.nativeElement).focus();
    }
  }
  onSubmit() {
    console.log(
      'Verification code submitted:',
      this.verifyOTPForm.value.verificationCode
    );
    let mail = localStorage.getItem('signupMail');
    let requestBody = {
      email: mail ? mail : '',
      otp: this.verifyOTPForm.value.verificationCode,
    };
    this.emailVerificationService.verifyOtp(requestBody).subscribe(
      (response) => {
        console.log(response);
        this.router.navigateByUrl('/');
      },
      (error) => {
        this.errorFlag = true;
        this.authorizationMessage = error.error.error;
      }
    );
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
