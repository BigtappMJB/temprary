import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.css']
})
export class DialogPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title?: string }
  ) { 
    // Set default data if not provided
    if (!this.data) {
      this.data = { message: 'Are you sure?' };
    }
  }
}
