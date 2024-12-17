import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { MyAppHttp } from 'src/app/shared/services/myAppHttp.service';
import { HeaderService } from 'src/app/core/layout/header/service/header.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  loginData: any;
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  dataDumm: any;
  validation_messages = {
    email_id: [{ type: 'required', message: 'Please enter login Id' }],
    password: [{ type: 'required', message: 'Please enter password' }],
  };
  errorFlag: boolean = false;
  authorizationMessage: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private dataStorageService: DataStorageService,
    public sendReceiveService: SendReceiveService,
    private userIdle: UserIdleService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    if (this.router.url == '/logout' || this.router.url == '/inv/dm/logout') {
      this.dataStorageService.isUserLoggedIn = false;
      this.onSignOut();
    }
    if (this.dataStorageService.isUserLoggedIn) {
      this.getModules();
    }

    this.LoginForm = this.formBuilder.group({
      email: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      password: ['', Validators.compose([Validators.required])],
    });

    if (!this.router.url.includes('/logout')) {
      let scode = true;
      if (scode) {
        this.validateScode(scode);
      } else {
        if (!this.dataStorageService.isUserLoggedIn) {
          this.router.navigateByUrl('');
        }
      }
    }
    console.log(document.getElementsByTagName('meta'));

    const firstTime = localStorage.getItem('key');
    if (!firstTime) {
      localStorage.setItem('key', 'loaded');
      location.reload();
    } else {
      localStorage.removeItem('key');
    }

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (storedUsername && storedPassword) {
      (document.getElementById('rememberMe') as HTMLInputElement).checked =
        true;
      this.LoginForm.controls['email'].setValue(storedUsername);
      this.LoginForm.controls['password'].setValue(storedPassword);
    }
  }

  onSignOut() {
    let data = localStorage.getItem('LoginData');
    if (data) {
      this.loginData = JSON.parse(data);
    }
    if (this.loginData) {
      this.headerService
        .UserLogout(this.loginData.userId)
        .subscribe((response) => {
          localStorage.removeItem('LoginData');
          localStorage.removeItem('MenuList');
          localStorage.removeItem('userToken');
          this.dataStorageService.isUserLoggedIn = false;
          this.router.navigateByUrl('logout');
        });
    }
  }

  validateScode(scode: any) {
    console.log(scode);
    this.errorFlag = false;
    this.loginService.getLoginDetails(scode).subscribe(
      (response) => {
        if (response.roleStatus == 'N') {
          this.errorFlag = true;
          this.authorizationMessage = MyAppHttp.ToasterMessage.activeOrNot;
          return;
        }
        if (response.response.statusCode == 200) {
          this.onSuccessfullLogin(response);
        } else {
          this.errorFlag = true;
          this.authorizationMessage = response.message;
        }
      },
      (error) => {
        this.errorFlag = true;
        this.authorizationMessage = error.error.response.message;
      }
    );
  }

  getModules() {
    let data = localStorage.getItem('LoginData');
    if (data) {
      this.loginData = JSON.parse(data);
    }
    if (this.loginData) {
      let tempSubMenuName = [];
      let totalMenus = this.loginData.permissions;
      for (let menu of totalMenus) {
        for (let subModule of menu.submodules) {
          if (menu.submodules.permissionId !== 6) {
            tempSubMenuName.push(subModule.subModuleId);
          }
        }
      }
      let subMenuName = tempSubMenuName[0];
      this.sendReceiveService.navigateToMenu(subMenuName);
    }
  }

  clkSignin() {
    this.errorFlag = false;
    console.log(this.validation_messages);

    this.dataDumm = {
      userName: this.LoginForm.value.email,
      passWord: 'sad',
    };

    if (this.LoginForm.valid) {
      localStorage.setItem('username', this.LoginForm.value.email);
      localStorage.setItem('password', this.LoginForm.value.password);
      let encryptedPassword = btoa(this.LoginForm.value.password);
      this.loginService
        .getLoginDetails({
          userName: this.LoginForm.value.email,
          passWord: encryptedPassword,
        })
        .subscribe(
          (response) => {
            if (response.roleStatus == 'N') {
              this.errorFlag = true;
              this.authorizationMessage = MyAppHttp.ToasterMessage.activeOrNot;
              return;
            }

            if (response.isDefaultPasswordChanged == null) {
              localStorage.setItem('LoginData', JSON.stringify(response));
              this.router.navigateByUrl('/changepassword');
              return;
            }
            if (response.response.statusCode == 200) {
              this.onSuccessfullLogin(response);
            } else {
              this.errorFlag = true;
              this.authorizationMessage = response.message;
            }
          },
          (error) => {
            this.errorFlag = true;
            this.authorizationMessage = error.error.response.message;
          }
        );
    }
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  getAllPermittedModules() {
    let tempSubMenuName = [];
    let totalMenus = this.loginData.permissions;
    for (let menu of totalMenus) {
      for (let subModule of menu.submodules) {
        if (menu.submodules.permissionId !== 6) {
          tempSubMenuName.push(subModule.subModuleId);
        }
      }
    }
    let subMenuName = tempSubMenuName[0];
    this.sendReceiveService.navigateToMenu(subMenuName);
  }
  checkRemember(event: any) {
    const checkbox = event.target as HTMLInputElement;
    this.rememberMe = checkbox.checked;
    console.log(this.rememberMe);
  }
  onSuccessfullLogin(response: any) {
    localStorage.removeItem('LoginData');
    localStorage.removeItem('MenuList');
    localStorage.removeItem('userToken');
    this.dataStorageService.isUserLoggedIn = true;

    localStorage.setItem('LoginData', JSON.stringify(response));
    localStorage.setItem('userToken', response.userToken);
    if (this.rememberMe) {
      localStorage.setItem('username', this.LoginForm.value.email);
      localStorage.setItem('password', this.LoginForm.value.password);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
    let data = localStorage.getItem('LoginData');
    if (data) {
      this.loginData = JSON.parse(data);
    }
    if (this.loginData) {
      this.getAllPermittedModules();
    }
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe((count) => {
      if (count > 1) {
        this.headerService
          .UserLogout(this.loginData.userId)
          .subscribe((resp: any) => {
            localStorage.removeItem('LoginData');
            localStorage.removeItem('MenuList');
            localStorage.removeItem('userToken');
            this.dataStorageService.isUserLoggedIn = false;
            this.router.navigateByUrl('/');
          });
        console.log(count);
        this.stopWatching();
      }
    });
    this.userIdle.onTimeout().subscribe(() => console.log('Time is up!'));
  }
}
