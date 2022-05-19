import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiModule } from 'api-nisq/api.module';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ImplementationSelectionCriteriaComponent } from './components/implementation-selection-criteria/implementation-selection-criteria.component';
import { QpuSelectionComponent } from './components/qpu-selection/qpu-selection.component';
import { AlgorithmsImplementationsListComponent } from './components/algorithms-implementations-list/algorithms-implementations-list.component';
// eslint-disable-next-line max-len
import { AddImplementationDialogComponent } from './components/algorithms-implementations-list/dialogs/add-implementation-dialog/add-implementation-dialog.component';
import { UtilService } from './components/util/util.service';
import { CreateSdkDialogComponent } from './components/implementation-selection-criteria/dialogs/create-sdk-dialog/create-sdk-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PageNotFoundComponent,
    ImplementationSelectionCriteriaComponent,
    QpuSelectionComponent,
    AlgorithmsImplementationsListComponent,
    AddImplementationDialogComponent,
    CreateSdkDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ApiModule.forRoot({ rootUrl: environment.NISQ_API_URL }),
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatExpansionModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [UtilService],
  bootstrap: [AppComponent],
})
export class AppModule {}
