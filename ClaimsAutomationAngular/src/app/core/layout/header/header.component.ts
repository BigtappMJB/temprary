import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { HeaderService } from './service/header.service';
import { SideBarService } from '../side-nav/side-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  loginData: any;
  constructor(
    private readonly router: Router,
    private readonly dataStorageService: DataStorageService,
    private readonly headerService: HeaderService,
    private readonly sidebarService: SideBarService
  ) {}
  sidebar!: any;

  ngOnInit(): void {
    if (localStorage.getItem('LoginData')) {
      let data = localStorage.getItem('LoginData');
      if (data) {
        this.loginData = JSON.parse(data);
      }
    }
  }

  ngAfterViewInit() {
    this.sidebarService.sidebarState$.subscribe((state) => {
      this.sidebar = state;
    });
  }

  onMobileNavClick() {
    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });
  }

  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }
  openSideBar() {
    this.sidebarService.toggleSidebar();
  }

  onSignOut() {
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
