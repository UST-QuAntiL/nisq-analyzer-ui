import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddImplementationDialogComponent } from '../algorithms-implementations-list/dialogs/add-implementation-dialog/add-implementation-dialog.component';
import { CreateSdkDialogComponent } from './implementation-selection-criteria/dialogs/create-sdk-dialog/create-sdk-dialog.component';
import { QpuSelectionComponent } from './qpu-selection/qpu-selection.component';
import { ImplementationSelectionCriteriaComponent } from './implementation-selection-criteria/implementation-selection-criteria.component';
import { ImplementationViewComponent } from './implementation-view.component';
// eslint-disable-next-line max-len
import { QpuSelectionSensitivityAnalysisDialogComponent } from './qpu-selection/dialogs/qpu-selection-sensitivity-analysis-dialog/qpu-selection-sensitivity-analysis-dialog.component';
// eslint-disable-next-line max-len
import { QpuSelectionLearnedWeightsDialogComponent } from './qpu-selection/dialogs/qpu-selection-learned-weights-dialog/qpu-selection-learned-weights-dialog.component';
// eslint-disable-next-line max-len
import { QpuSelectionPrioritizationDialogComponent } from './qpu-selection/dialogs/qpu-selection-prioritization-dialog/qpu-selection-prioritization-dialog.component';

@NgModule({
  declarations: [
    ImplementationViewComponent,
    ImplementationSelectionCriteriaComponent,
    QpuSelectionComponent,
    AddImplementationDialogComponent,
    CreateSdkDialogComponent,
    QpuSelectionSensitivityAnalysisDialogComponent,
    QpuSelectionLearnedWeightsDialogComponent,
    QpuSelectionPrioritizationDialogComponent,
  ],
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatStepperModule,
    MatCheckboxModule,
    MatExpansionModule,
  ],
})
export class ImplementationViewModule {}
