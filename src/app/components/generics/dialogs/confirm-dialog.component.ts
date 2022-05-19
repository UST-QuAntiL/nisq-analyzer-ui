import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-algorithm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  variableName?: string;
  data?: any[];
  yesButtonText: string;
  noButtonText: string;
}
