import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdministrationModule } from './features/administration/administration.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { DataStorageService } from './shared/services/data-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { StaticDataUploadModule } from './features/static-data-upload/static-data-upload.module';
import { DndDirective } from './dnd.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SendReceiveService } from './shared/services/sendReceive.service';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './core/services/auth/auth.service';
import { ViewDataService } from './features/view-data/service/view-data.service';
import {
  DatePipe,
  APP_BASE_HREF,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import { DialogComponent } from './dialog/dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewDataComponent } from './features/view-data/view-data.component';
import { UserIdleModule } from 'angular-user-idle';
import { NglrxPipesModule } from '@nglrx/pipes';
import { RegisterationComponent } from './features/auth/registeration/registeration.component';
import { EmailVerificationComponent } from './features/auth/email-verification/email-verification.component';
import { ForgetPasswordComponent } from './features/auth/forget-password/forget-password.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    ViewDataComponent,
    DndDirective,
    DialogComponent,
    RegisterationComponent,
    EmailVerificationComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AdministrationModule,
    SharedModule,
    CoreModule,
    HttpClientModule,
    StaticDataUploadModule,
    MatPaginatorModule,
    NglrxPipesModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    MatSnackBarModule,
    UserIdleModule.forRoot({ idle: 600, timeout: 300, ping: 120 }),
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatAutocompleteModule,
  ],
  // providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, DataStorageService, SendReceiveService, AuthGuard, ViewDataService, DatePipe, BnNgIdleService],
  providers: [
    { provide: APP_BASE_HREF, useValue: 'claims' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DataStorageService,
    SendReceiveService,
    AuthGuard,
    ViewDataService,
    DatePipe,
    BnNgIdleService,
  ],
  // providers: [{ provide: APP_BASE_HREF, useValue: '/inv/dm' }, DataStorageService, SendReceiveService, AuthGuard, ViewDataService, DatePipe, BnNgIdleService],
  // providers: [{ provide: APP_BASE_HREF, useValue: 'dm' }, DataStorageService, SendReceiveService, AuthGuard, ViewDataService, DatePipe, BnNgIdleService],
  bootstrap: [AppComponent],
})
export class AppModule {}
