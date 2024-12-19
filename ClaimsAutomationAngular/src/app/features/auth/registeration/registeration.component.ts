import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { RegisterationService } from './service/registeration.service';
import { LoadingService } from 'src/app/shared/components/loading-service.service';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css'],
})
export class RegisterationComponent implements OnInit {
  @ViewChild('firstName') firstName!: ElementRef;

  signupForm!: FormGroup;
  errorFlag = false;
  validation_messages = {
    firstName: [{ type: 'required', message: 'First Name is required' }],
    lastName: [{ type: 'required', message: 'Last Name is required' }],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Email is Invalid' },
    ],
    mobileNo: [{ type: 'required', message: 'Mobile Number is required' }],
  };
  authorizationMessage: any;

  constructor(
    private readonly router: Router,
    public sendReceiveService: SendReceiveService,
    private readonly fb: FormBuilder,
    private readonly registerationService: RegisterationService,
    private readonly loadingService: LoadingService,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    if (this.firstName) {
      this.renderer.selectRootElement(this.firstName.nativeElement).focus();
    }
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
          ),
        ],
      ],
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  onKeyPress(event: any) {
    const pattern = /[\d]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Submitted!', this.signupForm.value);
      let registerRequestBody = {
        first_name: this.signupForm.value.firstName.trim(),
        last_name: this.signupForm.value.lastName.trim(),
        email: this.signupForm.value.email.trim(),
        mobile: this.signupForm.value.mobileNo.trim(),
      };
      this.loadingService.show();
      this.registerationService
        .postRegisterationDetails(registerRequestBody)
        .subscribe(
          (response) => {
            this.loadingService.hide();

            if (response.message == 'OTP sent to email successfully') {
              localStorage.setItem('signupMail', this.signupForm.value.email);
              this.router.navigateByUrl('/verifyOTP');
            }
          },
          (error) => {
            this.loadingService.hide();

            this.errorFlag = true;
            this.authorizationMessage = error.error.error;
          }
        );
    }
  }
}
