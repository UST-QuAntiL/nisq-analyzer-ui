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
  selector: 'app-add-implementation-dialog',
  templateUrl: './add-implementation-dialog.component.html',
  styleUrls: ['./add-implementation-dialog.component.scss'],
})
export class AddImplementationDialogComponent implements OnInit {
  addImplementationFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddImplementationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog
  ) {}

  get algorithmName(): AbstractControl | null {
    return this.addImplementationFrom.get('algorithmName');
  }

  get name(): AbstractControl | null {
    return this.addImplementationFrom.get('name');
  }

  get sdk(): AbstractControl | null {
    return this.addImplementationFrom.get('sdk');
  }

  get language(): AbstractControl | null {
    return this.addImplementationFrom.get('language');
  }

  get contentLocation(): AbstractControl | null {
    return this.addImplementationFrom.get('contentLocation');
  }

  ngOnInit(): void {
    this.addImplementationFrom = new FormGroup({
      algorithmName: new FormControl(this.data.algorithmName, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
        Validators.maxLength(255),
      ]),
      name: new FormControl(this.data.name, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
        Validators.maxLength(255),
      ]),
      sdk: new FormControl(this.data.sdk, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      language: new FormControl(this.data.language, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      contentLocation: new FormControl(this.data.contentLocation, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
    });

    this.sdk.setValue('qiskit');
    this.language.setValue('openqasm');

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.algorithmName = this.algorithmName.value;
      this.data.name = this.name.value;
      this.data.sdk = this.sdk.value;
      this.data.language = this.language.value;
      this.data.contentLocation = this.contentLocation.value;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isRequiredDataMissing(): boolean {
    return this.algorithmName.errors?.required;
    return this.name.errors?.required;
    return this.sdk.errors?.required;
    return this.language.errors?.required;
    return this.contentLocation.errors?.required;
  }
}

interface DialogData {
  title: string;
  algorithmName: string;
  name: string;
  sdk: string;
  language: string;
  contentLocation: string;
}
