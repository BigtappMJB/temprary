import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'src/app/notifier.service';
import { MyAppHttp } from 'src/app/shared/services/myAppHttp.service';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { RolesService } from './service/roles.service';
import { DialogPopupComponent } from 'src/app/shared/dialog-popup/dialog-popup.component';
import { LoadingService } from 'src/app/shared/components/loading-service.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'roleName', 'actions'];
  RolesList: any = [];
  AddRoleForm!: FormGroup;
  isAddRoleForm: boolean = false;
  filterData: any;
  gridData = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pagePermissions: any;
  loginData: any;
  menuList: any = [];
  permissionName: any;
  editMode: any;
  editedRole: any;
  errorMessage: any;
  Message: any;
  errorType: any;
  validt: any;

  constructor(
    private readonly rolesService: RolesService,
    public readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
    public sendReceiveService: SendReceiveService,
    private readonly notifierService: NotifierService,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.filterData = {
      filterColumnNames: [
        { Key: 'sno', Value: '' },
        { Key: 'roleName', Value: '' },
      ],
      gridData: this.gridData,
      dataSource: this.dataSource,
      paginator: this.paginator,
      sort: this.sort,
    };
    this.AddRoleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
    });
    this.getRoles();
    this.setPageLevelPermissions();
  }

  updatePagination() {
    this.filterData.dataSource.paginator = this.paginator;
  }

  getRoles() {
    this.loadingService.show();
    this.rolesService.getRolesList().subscribe(
      (response) => {
        const rolesData: any = [];
        for (let i = 0; i < response.length; i++) {
          response[i].sno = i + 1;
          rolesData.push(response[i]);
        }
        this.RolesList = rolesData;
        this.filterData.gridData = rolesData;
        this.dataSource = new MatTableDataSource(rolesData);
        this.filterData.dataSource = this.dataSource;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filterData.sort = this.sort;
        for (let col of this.filterData.filterColumnNames) {
          col.Value = '';
        }
        this.loadingService.hide();
      },
      (error: any) => {
        console.error(error);
        this.loadingService.hide();
      }
    );
  }

  onAddRoleSubmit() {
    if (this.AddRoleForm.valid) {
      this.loadingService.show();
      if (this.editMode) {
        this.onEditMode();
      } else {
        this.rolesService.addRoles(this.AddRoleForm.value).subscribe(
          (response) => {
            this.loadingService.hide();
            if (response.statusCode == 200) {
              this.isAddRoleForm = false;
              this.getRoles();
              this.AddRoleForm.reset();
              this.notifierService.showNotification(
                'Success',
                response.message
              );
            } else {
              this.notifierService.showNotification('Error', response.message);
            }
          },
          (error) => {
            console.log(error);
            this.loadingService.hide();

            this.notifierService.showNotification('Error', error.error.message);
          }
        );
      }
    }
  }

  onEditMode() {
    this.validt = 0;
    let role = {
      id: this.editedRole.id,
      isActive: this.editedRole.isActive,
      isDeleted: this.editedRole.isDeleted,
      roleId: this.editedRole.roleId,
      roleName: this.AddRoleForm.value.roleName,
    };
    for (let roleList of this.RolesList) {
      if (roleList.roleName == role.roleName) {
        this.notifierService.showNotification('Error', 'Role Already Exist');
        this.validt = 1;
        break;
      }
    }
    if (this.validt != 1) {
      this.rolesService.saveRole(role).subscribe(
        (response) => {
          if (response.statusCode == 200) {
            this.isAddRoleForm = false;
            this.editMode = false;
            this.getRoles();
            this.loadingService.hide();

            this.notifierService.showNotification('Success', response.message);
          } else {
            this.loadingService.hide();
            this.notifierService.showNotification('Error', response.message);
            this.getRoles();
          }
        },
        (error) => {
          console.log(error);
          this.loadingService.hide();

          this.notifierService.showNotification('Error', error.error.message);
        }
      );
    }
  }

  onAddRole() {
    this.isAddRoleForm = true;
    this.AddRoleForm.reset();
  }

  onCancel() {
    this.isAddRoleForm = false;
  }

  setPageLevelPermissions() {
    if (localStorage.getItem('LoginData')) {
      let data = localStorage.getItem('LoginData');
      if (data) {
        this.loginData = JSON.parse(data);
      }
      this.menuList = this.loginData.permissions;
      for (let menu of this.menuList) {
        for (let submodule of menu.submodules) {
          if (submodule.subModuleName == 'Roles') {
            this.permissionName = submodule.permissionName;
            this.pagePermissions =
              this.sendReceiveService.getPageLevelPermissions(
                this.permissionName
              );
          }
        }
      }
    }
  }

  onEditRole(role: any) {
    this.editMode = true;
    this.editedRole = role;
    this.AddRoleForm.patchValue({
      roleName: role.roleName,
    });
    this.isAddRoleForm = true;
  }

  onActivateRole(role: any, event: MatSlideToggleChange) {
    if (event.checked) {
      role.isActive = 'Y';
    } else {
      role.isActive = 'N';
    }
    this.rolesService.saveRole(role).subscribe((response) => {
      this.getRoles();
    });
  }

  onRoleDelete(role: any) {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this data?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingService.show();

        this.rolesService.deleteRole(role).subscribe(
          (response) => {
            if (response.statusCode == 200) {
              this.getRoles();
              this.loadingService.hide();

              this.notifierService.showNotification(
                'Success',
                response.message
              );
            } else {
              this.notifierService.showNotification('Error', response.message);
            }
          },
          (error) => {
            console.log(error);
            this.loadingService.hide();

            this.notifierService.showNotification('Error', error.message);
          }
        );
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  setMessage(type: any, message: any) {
    this.errorMessage = true;
    this.errorType = type;
    this.Message = message;
    setTimeout(() => {
      this.errorMessage = false;
    }, MyAppHttp.notificationTimeOut);
  }
}
