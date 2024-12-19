import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvGeneratorComponent } from './csv-generator/csv-generator.component';
import { RolePermissionsComponent } from './role-permissions/role-permissions.component';
import { RolesComponent } from './roles/roles.component';
import { TableConfiguratorComponent } from './table-configurator/table-configurator.component';
import { UserComponent } from './user/user.component';
import { CsvSchedulerComponent } from './csv-scheduler/csv-scheduler.component';
import { SchedulerRecordDetailsComponent } from './scheduler-record-details/scheduler-record-details.component';
import { FileMappingComponent } from './file-mapping/file-mapping.component';

const routes: Routes = [
  { path: 'users', component: UserComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'rBAPermission', component: RolePermissionsComponent },
  { path: 'tableConfigurator', component: TableConfiguratorComponent },
  { path: 'generatorDetails', component: CsvGeneratorComponent },
  {
    path: 'schedulerDetails/:id/:schedularName/:status',
    component: SchedulerRecordDetailsComponent,
  },
  { path: 'schedulerDetails', component: CsvSchedulerComponent },
  { path: 'fileMapping', component: FileMappingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
