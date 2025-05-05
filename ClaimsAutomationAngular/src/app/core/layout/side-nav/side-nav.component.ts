import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LengthPipe } from '@nglrx/pipes';
import { browserRefresh } from 'src/app/app.component';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { SendReceiveService } from 'src/app/shared/services/sendReceive.service';
import { FileUploadNavigationService } from 'src/app/shared/services/file-upload-navigation.service';
import { SideBarService } from './side-bar.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
  providers: [LengthPipe],
})
export class SideNavComponent implements OnInit {
  menuList: any = [];
  loginData: any;
  menuId: any;
  selectedIndex: number = 0;
  isRefresh!: boolean;
  selectedSubModuleId: any;
  className: any;
  isSideBarMinimized: boolean = false;
  isMobileSidebarActive: boolean = false;

  status!: any;
  clickEvent() {
    this.status = !this.status;
  }
  sidebar: boolean = false;

  constructor(
    private readonly dataStorageService: DataStorageService,
    public router: Router,
    public sendReceiveService: SendReceiveService,
    private readonly lengthPipe: LengthPipe,
    private readonly sidebarService: SideBarService,
    private readonly fileUploadNavigationService: FileUploadNavigationService
  ) {
    this.lengthPipe.transform('Yet-another-string');
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarActive = !this.isMobileSidebarActive;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarActive = false; // Close the sidebar on menu item click
  }

  ngOnInit(): void {
    if (localStorage.getItem('LoginData')) {
      let data = localStorage.getItem('LoginData');
      if (data) {
        this.loginData = JSON.parse(data);
        if (this.loginData.isDefaultPasswordChanged == null) {
          this.menuList = [];
        } else {
          this.menuList = this.loginData.permissions;
        }
        localStorage.setItem('MenuList', JSON.stringify(this.menuList));
      }

      this.className = false;
      this.isRefresh = browserRefresh;
      this.selectedIndex = 0;
      this.menuId = 1;
      this.refresh();
    }
  }
  ngAfterViewInit() {
    this.sidebarService.sidebarState$.subscribe((state) => {
      this.sidebar = state;
    });
  }

  refresh() {
    if (!this.isRefresh) {
      return;
    }
    this.className = false;
    if (localStorage.getItem('menuIndex')) {
      this.selectedIndex = Number(localStorage.getItem('menuIndex'));
    }
    this.selectedSubModuleId = localStorage.getItem('selectedSubModuleId');
    const selectedSubMenuId = Number(this.selectedSubModuleId);
    this.menuList.forEach((module: any) => {
      module.submodules.forEach((subModule: any) => {
        if (subModule.subModuleId === selectedSubMenuId) {
          this.menuId = subModule.subModuleId;
        }
      });
    });
  }

  onModule(index: any) {
    this.selectedIndex = index;

    localStorage.setItem('menuIndex', index);
  }
  onMobileNavClick() {
    this.sidebar = !this.sidebar;
  }

  navigateToSubMenu(menu: any) {
    console.log('Menu item clicked:', menu);
    this.menuId = menu.subModuleId;
    localStorage.setItem('selectedSubModuleId', this.menuId);

    // Special cases for direct navigation
    if (menu.subModuleName === 'CAD') {
      // Use the navigation service for CAD (subModuleId 19)
      console.log('Navigating to CAD File Upload');
      this.fileUploadNavigationService.navigateToFileUpload(19);
    } else if (menu.subModuleName === 'CMD') {
      // Use the navigation service for CMD (subModuleId 18)
      console.log('Navigating to CMD File Upload');
      this.fileUploadNavigationService.navigateToFileUpload(18);
    } else if (menu.subModuleName === 'Data View') {
      // Use the navigation service for CMD (subModuleId 18)
      console.log('Navigating to view data ');
      this.router.navigateByUrl('viewData/dataView');
    } else if (menu.subModuleName === 'CSV Scheduler') {
      // Navigate to CSV Scheduler page
      console.log(
        'Navigating to CSV Scheduler with subModuleId:',
        menu.subModuleId
      );

      // Store a special flag to indicate we're going to CSV Scheduler
      localStorage.setItem('navigatingToScheduler', 'true');

      // Store the subModuleId in a different key to avoid conflict with file upload
      localStorage.setItem('schedulerSubModuleId', menu.subModuleId.toString());

      // Remove the selectedSubModuleId to prevent file upload navigation
      localStorage.removeItem('selectedSubModuleId');

      // Force navigation by first going to a dummy route and then to the scheduler details
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        console.log('Now navigating to administration/schedulerDetails');
        this.router.navigate(['administration/schedulerDetails']);
      });
    } else if (menu.subModuleName === 'CSV Generator') {
      // Direct navigation for CSV Generator
      console.log('Navigating to CSV Generator');
      this.router.navigateByUrl('administration/csvgenerator');
    } else {
      console.log('Navigating with subMenuId:', this.menuId);
      this.sendReceiveService.navigateToMenu(this.menuId);
    }
  }
}
