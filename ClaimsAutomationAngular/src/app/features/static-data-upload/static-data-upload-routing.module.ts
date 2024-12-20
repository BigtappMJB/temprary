import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityRelatedComponent } from './entity-related/entity-related.component';
import { StaticReferenceComponent } from './static-reference/static-reference.component';
import { MappinguploadComponent } from './mappingupload/mappingupload.component';
import { MappingViewDataComponent } from './mapping-view-data/mapping-view-data.component';

const routes: Routes = [
  { path: 'cAD', component: EntityRelatedComponent },
  { path: 'cMD', component: StaticReferenceComponent },
  { path: 'loadMappingDetails', component: MappinguploadComponent },
  { path: 'viewMappings', component: MappingViewDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticDataUploadRoutingModule {}
