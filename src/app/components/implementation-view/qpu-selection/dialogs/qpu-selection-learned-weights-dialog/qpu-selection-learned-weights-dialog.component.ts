import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { XmcdaCriteriaService } from 'api-nisq/services/xmcda-criteria.service';
// eslint-disable-next-line max-len
import { Criterion } from '../qpu-selection-prioritization-dialog/qpu-selection-prioritization-dialog.component';

@Component({
  selector: 'app-qpu-selection-learned-weights-dialog',
  templateUrl: './qpu-selection-learned-weights-dialog.component.html',
  styleUrls: ['./qpu-selection-learned-weights-dialog.component.scss'],
})
export class QpuSelectionLearnedWeightsDialogComponent implements OnInit {
  weightLearningForm: FormGroup;
  criteriaNamesAndValues: Criterion[] = [];
  inputChanged = false;

  constructor(
    public dialogRef: MatDialogRef<QpuSelectionLearnedWeightsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private mcdaService: XmcdaCriteriaService
  ) {}

  get criteriaAndValues(): AbstractControl | null {
    return this.weightLearningForm.get('criteriaAndValues');
  }

  ngOnInit(): void {
    this.onMcdaMethodChanged();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onMcdaMethodChanged(): void {
    this.criteriaNamesAndValues = [];
    this.mcdaService
      .getCriterionForMethod({ methodName: this.data.mcdaMethod })
      .subscribe((criteriaList) => {
        // then get for each criterion the name and value and store both in the map as value
        criteriaList.mcdaCriterionList.forEach((criterion) => {
          this.mcdaService
            .getCriterionValue({
              methodName: this.data.mcdaMethod,
              criterionId: criterion.id,
            })
            .subscribe((criterionValueModel) => {
              const value = criterionValueModel.valueOrValues.pop();
              if (value) {
                const realValue = value['real'];
                this.criteriaNamesAndValues.push({
                  id: criterion.id,
                  name: criterion.name,
                  weight: realValue,
                  points: Math.round(
                    Number(criterionValueModel.description.subTitle)
                  ),
                });
              }
              this.weightLearningForm = this.formBuilder.group({
                criteriaAndValues: this.formBuilder.array(
                  this.criteriaNamesAndValues.map((c) =>
                    this.formBuilder.group({
                      [c.name]: [c.weight],
                    })
                  )
                ),
              });
              this.dialogRef.beforeClosed().subscribe(() => {
                this.criteriaNamesAndValues.forEach((criterionVal) => {
                  for (const val of this.criteriaAndValues.value) {
                    if (criterionVal.name === Object.keys(val)[0]) {
                      if (criterionVal.name !== 'queue-size') {
                        criterionVal.weight = Number(Object.values(val)[0]);
                      } else {
                        criterionVal.weight = 0.0;
                      }
                      break;
                    }
                  }
                  this.data.criteriaAndValues = this.criteriaNamesAndValues;
                });
              });
            });
        });
      });
  }

  onChangeEvent(): void {
    this.inputChanged = true;
  }
}

export interface DialogData {
  title: string;
  mcdaMethod: string;
  criteriaAndValues: Criterion[];
}
