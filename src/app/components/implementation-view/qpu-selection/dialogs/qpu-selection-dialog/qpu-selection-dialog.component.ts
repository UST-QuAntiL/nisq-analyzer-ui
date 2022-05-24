import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { RootService } from 'api-nisq/services/root.service';
import { UtilService } from '../../../../util/util.service';

@Component({
  selector: 'app-qpu-selection-dialog',
  templateUrl: './qpu-selection-dialog.component.html',
  styleUrls: ['./qpu-selection-dialog.component.scss'],
})
export class QpuSelectionDialogComponent implements OnInit {
  qpuSelectionFrom: FormGroup;
  ready?: boolean;
  isIbmqSelected = true;
  isSimulatorAllowed = false;
  selectedCompilers: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<QpuSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private rootService: RootService,
    private utilService: UtilService
  ) {}

  get vendor(): AbstractControl | null {
    return this.qpuSelectionFrom.get('vendor');
  }

  get simulatorAllowed(): AbstractControl | null {
    return this.qpuSelectionFrom.get('simulatorAllowed');
  }

  get token(): AbstractControl | null {
    return this.qpuSelectionFrom.get('token');
  }

  get compilers(): FormArray {
    return this.qpuSelectionFrom.get('compilers') as FormArray;
  }

  ngOnInit(): void {
    this.qpuSelectionFrom = new FormGroup({
      vendor: new FormControl(this.data.vendor, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      simulatorAllowed: new FormControl(this.data.simulatorAllowed, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      token: new FormControl(this.data.token, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.maxLength(255),
      ]),
      compilers: new FormArray([]),
    });

    this.vendor.setValue('IBMQ');
    this.onVendorChanged(this.vendor.value);
    this.simulatorAllowed.setValue(true);
    this.setCompilerOptions(this.vendor.value);

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.vendor = this.vendor.value;
      this.data.simulatorAllowed = this.simulatorAllowed.value;
      this.data.token = this.token.value;
      if (this.data.isLoggedIn) {
        this.data.selectedCompilers = ['qiskit'];
      } else {
        this.data.selectedCompilers = this.selectedCompilers;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isRequiredDataMissing(): boolean {
    return this.vendor.errors?.required;
  }

  onVendorChanged(value: string): void {
    this.isIbmqSelected = true;
    if (value === 'IBMQ') {
      this.setCompilerOptions(value);
    } else {
      this.isIbmqSelected = false;
      this.setCompilerOptions(value);
    }
  }

  setSimulatorAllowed(allowed: boolean): void {
    this.isSimulatorAllowed = allowed;
    this.simulatorAllowed.setValue(this.isSimulatorAllowed);
  }

  updateCompilerSelection(compilerName: string, allowed: boolean): void {
    if (allowed) {
      this.selectedCompilers.push(compilerName);
    } else {
      this.selectedCompilers = this.selectedCompilers.filter(
        (item) => item !== compilerName
      );
    }
    if (this.selectedCompilers.length < 1) {
      this.utilService.callSnackBar('Select at least  one compiler');
    }
  }

  checkIfCompilerSelected(compilerName: string): boolean {
    return this.selectedCompilers.includes(compilerName);
  }

  checkIfCompilersPresent(): boolean {
    if (this.selectedCompilers.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  setCompilerOptions(vendor: string): void {
    this.rootService
      .getCompilers({ provider: vendor })
      .subscribe((availableCompilers) => {
        this.selectedCompilers = availableCompilers;
        this.compilers.clear();
        for (const compiler of availableCompilers) {
          this.compilers.push(new FormControl(compiler));
        }
      });
  }
}

interface DialogData {
  title: string;
  isLoggedIn: boolean;
  vendor: string;
  simulatorAllowed: boolean;
  token: string;
  selectedCompilers: string[];
}
