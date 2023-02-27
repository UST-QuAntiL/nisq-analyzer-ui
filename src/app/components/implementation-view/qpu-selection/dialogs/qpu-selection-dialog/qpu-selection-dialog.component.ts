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
  selectedCompilers: string[] = [];

  shortWaitingTimeEnabled = false;
  stableExecutionResultsEnabled = false;
  predictionAlgorithmInDialog = 'extra_trees_regressor';
  metaOptimizerInDialog = 'ada_boost_regressor';
  advancedSettingsOpen: boolean;
  queueImportanceRatioDialog = 0;
  inputChanged = false;
  maxNumberOfCompiledCircuitsDialog = 5;

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

  get token(): AbstractControl | null {
    return this.qpuSelectionFrom.get('token');
  }

  get compilers(): FormArray {
    return this.qpuSelectionFrom.get('compilers') as FormArray;
  }

  get shortWaitingTime(): AbstractControl | null {
    return this.qpuSelectionFrom.get('shortWaitingTime');
  }

  get stableExecutionResults(): AbstractControl | null {
    return this.qpuSelectionFrom.get('stableExecutionResults');
  }

  get predictionAlgorithm(): AbstractControl | null {
    return this.qpuSelectionFrom.get('predictionAlgorithm');
  }

  get metaOptimizer(): AbstractControl | null {
    return this.qpuSelectionFrom.get('metaOptimizer');
  }

  get maxNumberOfCompiledCircuits(): AbstractControl | null {
    return this.qpuSelectionFrom.get('maxNumberOfCompiledCircuits');
  }

  get queueImportanceRatio(): AbstractControl | null {
    return this.qpuSelectionFrom.get('queueImportanceRatio');
  }

  ngOnInit(): void {
    this.qpuSelectionFrom = new FormGroup({
      vendor: new FormControl(this.data.vendor, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      token: new FormControl(this.data.token),
      compilers: new FormArray([]),
      maxNumberOfCompiledCircuits: new FormControl(
        this.data.maxNumberOfCompiledCircuits,
        [
          // eslint-disable-next-line @typescript-eslint/unbound-method
          Validators.required,
        ]
      ),
      predictionAlgorithm: new FormControl(this.data.predictionAlgorithm, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      metaOptimizer: new FormControl(this.data.metaOptimizer, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      queueImportanceRatio: new FormControl(this.data.queueImportanceRatio, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      shortWaitingTime: new FormControl(this.data.shortWaitingTime, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      stableExecutionResults: new FormControl(
        this.data.stableExecutionResults,
        [
          // eslint-disable-next-line @typescript-eslint/unbound-method
          Validators.required,
        ]
      ),
    });

    this.vendor.setValue('IBMQ');
    this.onVendorChanged(this.vendor.value);
    this.setCompilerOptions(this.vendor.value);
    this.predictionAlgorithm.setValue('extra_trees_regressor');
    this.metaOptimizer.setValue('ada_boost_regressor');
    this.maxNumberOfCompiledCircuits.setValue(5);
    this.stableExecutionResults.setValue(false);
    this.shortWaitingTime.setValue(false);

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.vendor = this.vendor.value;
      this.data.token = this.token.value;
      this.data.maxNumberOfCompiledCircuits = this.maxNumberOfCompiledCircuitsDialog;
      this.data.metaOptimizer = this.metaOptimizerInDialog;
      this.data.predictionAlgorithm = this.predictionAlgorithmInDialog;
      this.data.queueImportanceRatio = this.queueImportanceRatioDialog;
      this.data.shortWaitingTime = this.shortWaitingTimeEnabled;
      this.data.stableExecutionResults = this.stableExecutionResultsEnabled;
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
  setWaitingTimeEnabled(enabled: boolean): void {
    this.shortWaitingTimeEnabled = enabled;
  }

  setStableExecutionResultsEnabled(enabled: boolean): void {
    this.stableExecutionResultsEnabled = enabled;
  }

  setPredictionAlgorithm(predictionAlgorithm: string): void {
    this.predictionAlgorithmInDialog = predictionAlgorithm;
  }

  setMetaOptimizer(metaOptimizer: string): void {
    this.metaOptimizerInDialog = metaOptimizer;
  }

  setMaxNumberOfCompiledCircuits(event): void {
    this.maxNumberOfCompiledCircuitsDialog = event;
  }

  setQueueImportanceRatio(event): void {
    this.queueImportanceRatioDialog = event.value / 100;
  }

  formatLabel(value: number): number | string {
    if (value >= 0) {
      return Math.round(value) + ':' + Math.round(100 - value);
    }
    return value;
  }
}

interface DialogData {
  title: string;
  isLoggedIn: boolean;
  vendor: string;
  token: string;
  selectedCompilers: string[];
  predictionAlgorithm: string;
  metaOptimizer: string;
  queueImportanceRatio: number;
  maxNumberOfCompiledCircuits: number;
  stableExecutionResults: boolean;
  shortWaitingTime: boolean;
}
