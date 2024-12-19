import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileuploadComponent } from '../file-upload/fileupload/fileupload.component';
import { ViewFileDataComponent } from './view-file-data/view-file-data.component';

const routes: Routes = [
  { path: 'loadData', component: FileuploadComponent },
  { path: 'viewData', component: ViewFileDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileUploadRoutingModule {}
