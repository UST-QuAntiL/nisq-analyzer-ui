import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-qpu-selection-execution-dialog',
  templateUrl: './qpu-selection-execution-dialog.component.html',
  styleUrls: ['./qpu-selection-execution-dialog.component.scss'],
})
export class QpuSelectionExecutionDialogComponent implements OnInit {
  qpuSelectionExecutionFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<QpuSelectionExecutionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog
  ) {}

  get token(): AbstractControl | null {
    return this.qpuSelectionExecutionFrom.get('token');
  }

  ngOnInit(): void {
    this.qpuSelectionExecutionFrom = new FormGroup({
      token: new FormControl(this.data.token, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.maxLength(255),
      ]),
    });
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.token = this.token.value;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  title: string;
  token: string;
}
