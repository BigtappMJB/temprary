import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityRelatedComponent } from './entity-related/entity-related.component';
import { StaticReferenceComponent } from './static-reference/static-reference.component';
import { MappinguploadComponent } from './mappingupload/mappingupload.component';
import { FileuploadComponent } from './fileupload/fileupload.component';

const routes: Routes = [
  { path: 'cAD', component: EntityRelatedComponent },
  { path: 'cMD', component: StaticReferenceComponent },
  { path: 'mappingupload', component: MappinguploadComponent },
  { path: 'vidalFileupload', component: FileuploadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticDataUploadRoutingModule { }
