import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadNavigationService {
  // BehaviorSubject to track the current subModuleId
  private currentSubModuleIdSource = new BehaviorSubject<number>(19); // Default to CAD
  currentSubModuleId$ = this.currentSubModuleIdSource.asObservable();

  constructor(private router: Router) { }

  // Method to navigate to file upload with specific subModuleId
  navigateToFileUpload(subModuleId: number) {
    console.log('FileUploadNavigationService: Navigating to file upload with subModuleId:', subModuleId);
    
    // Update the BehaviorSubject
    this.currentSubModuleIdSource.next(subModuleId);
    
    // Store in localStorage for persistence
    localStorage.setItem('selectedSubModuleId', subModuleId.toString());
    
    // Force navigation by first going to a dummy route and then to the file upload
    // This ensures the component is reloaded even when already on the file upload page
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/fileData/loadFileDetails']);
    });
  }

  // Method to get the current subModuleId
  getCurrentSubModuleId(): number {
    const storedId = localStorage.getItem('selectedSubModuleId');
    return storedId ? parseInt(storedId, 10) : 19; // Default to CAD if not found
  }
}