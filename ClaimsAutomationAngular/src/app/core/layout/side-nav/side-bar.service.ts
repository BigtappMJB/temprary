import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  private readonly sidebarState: BehaviorSubject<boolean>;

  // Observable for sidebar state
  sidebarState$;

  constructor() {
    // Check screen width and set initial state
    const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
    this.sidebarState = new BehaviorSubject<boolean>(!isMobile); // Close on mobile

    // Initialize the observable
    this.sidebarState$ = this.sidebarState.asObservable();
  }

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
  }
}
