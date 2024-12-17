import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth/auth.service';
import { ViewDataComponent } from './features/view-data/view-data.component';
import { RegisterationComponent } from './features/auth/registeration/registeration.component';
import { EmailVerificationComponent } from './features/auth/email-verification/email-verification.component';
import { ForgetPasswordComponent } from './features/auth/forget-password/forget-password.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'administration',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/administration/administration.module').then(
        (m) => m.AdministrationModule
      ),
  },
  {
    path: 'dataUpload',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/static-data-upload/static-data-upload.module').then(
        (m) => m.StaticDataUploadModule
      ),
  },
  {
    path: 'viewData/dataView',
    canActivate: [AuthGuard],
    component: ViewDataComponent,
  },
  { path: 'register', component: RegisterationComponent },
  { path: 'verifyOTP', component: EmailVerificationComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
