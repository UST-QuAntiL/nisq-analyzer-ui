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
import { AddImplementationDialogComponent } from '../algorithms-implementations-list/dialogs/add-implementation-dialog/add-implementation-dialog.component';
import { CreateSdkDialogComponent } from './implementation-selection-criteria/dialogs/create-sdk-dialog/create-sdk-dialog.component';
import { QpuSelectionComponent } from './qpu-selection/qpu-selection.component';
import { ImplementationSelectionCriteriaComponent } from './implementation-selection-criteria/implementation-selection-criteria.component';
import { ImplementationViewComponent } from './implementation-view.component';

@NgModule({
  declarations: [
    ImplementationViewComponent,
    ImplementationSelectionCriteriaComponent,
    QpuSelectionComponent,
    AddImplementationDialogComponent,
    CreateSdkDialogComponent,
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
  ],
})
export class ImplementationViewModule {}
