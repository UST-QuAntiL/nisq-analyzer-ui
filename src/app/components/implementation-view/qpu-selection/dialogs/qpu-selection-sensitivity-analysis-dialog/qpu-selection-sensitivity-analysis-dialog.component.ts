import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-qpu-selection-sensitivity-analysis-dialog',
  templateUrl: './qpu-selection-sensitivity-analysis-dialog.component.html',
  styleUrls: ['./qpu-selection-sensitivity-analysis-dialog.component.scss'],
})
export class QpuSelectionSensitivityAnalysisDialogComponent implements OnInit {
  sensitivityAnalysisForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<QpuSelectionSensitivityAnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog
  ) {}

  get stepSize(): AbstractControl | null {
    return this.sensitivityAnalysisForm.get('stepSize');
  }

  get upperBound(): AbstractControl | null {
    return this.sensitivityAnalysisForm.get('upperBound');
  }

  get lowerBound(): AbstractControl | null {
    return this.sensitivityAnalysisForm.get('lowerBound');
  }

  ngOnInit(): void {
    this.sensitivityAnalysisForm = new FormGroup({
      stepSize: new FormControl(this.data.stepSize, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      upperBound: new FormControl(this.data.upperBound, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      lowerBound: new FormControl(this.data.lowerBound, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
    });

    this.stepSize.setValue(0.01);
    this.upperBound.setValue(500);
    this.lowerBound.setValue(0.001);

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.stepSize = this.stepSize.value;
      this.data.upperBound = this.upperBound.value;
      this.data.lowerBound = this.lowerBound.value;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isRequiredDataMissing(): boolean {
    return this.upperBound.errors?.required;
    return this.lowerBound.errors?.required;
    return this.stepSize.errors?.required;
  }
}

interface DialogData {
  title: string;
  stepSize: number;
  upperBound: number;
  lowerBound: number;
}
