import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { RegisterationService } from './service/registeration.service';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {
  signupForm!: FormGroup;
  errorFlag = false;
  validation_messages = {
    firstName: [
      { type: 'required', message: 'Please enter first name' }
    ],
    lastName: [
      { type: 'required', message: 'Please enter last name' }
    ],
    email: [
      { type: 'required', message: 'Please enter email' },
      { type: 'pattern', message: 'Please enter valid email' }
    ],
    mobileNo: [
      { type: 'required', message: 'Please enter mobileNo' }
    ]
  };
  authorizationMessage: any;

  constructor(private router: Router,
    public sendReceiveService: SendReceiveService,
    private fb: FormBuilder,
    private registerationService: RegisterationService,
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(
        /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
      ),]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'),
      Validators.maxLength(10)]]
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
        "first_name": this.signupForm.value.firstName,
        "last_name": this.signupForm.value.lastName,
        "email": this.signupForm.value.email,
        "mobile": this.signupForm.value.mobileNo
      }
      this.registerationService.postRegisterationDetails(registerRequestBody)
        .subscribe((response) => {
          if (response.message == "OTP sent to email successfully") {
            localStorage.setItem("signupMail",this.signupForm.value.email);
            this.router.navigateByUrl("/verifyOTP");
          }
        }, (error) => {
          this.errorFlag = true;
          this.authorizationMessage = error.error.error;
        })
    }
  }
}