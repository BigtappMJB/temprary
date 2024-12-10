import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticDataUploadRoutingModule } from './static-data-upload-routing.module';
import { EntityRelatedComponent } from './entity-related/entity-related.component';
import { StaticReferenceComponent } from './static-reference/static-reference.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappinguploadComponent } from '../static-data-upload/mappingupload/mappingupload.component';
import { FileuploadComponent } from '../static-data-upload/fileupload/fileupload.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    EntityRelatedComponent,
    StaticReferenceComponent,
    MappinguploadComponent,
    FileuploadComponent
  ],
  imports: [
    CommonModule,
    StaticDataUploadRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StaticDataUploadModule { }
