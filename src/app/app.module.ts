import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiModule } from 'api-nisq/api.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AlgorithmsImplementationsListComponent } from './components/algorithms-implementations-list/algorithms-implementations-list.component';
// eslint-disable-next-line max-len
import { UtilService } from './components/util/util.service';
import { AuthInterceptor } from './components/http-interceptors/auth-interceptor';
import { initializeKeycloak } from './components/util/keycloak-init';
// eslint-disable-next-line max-len
import { AddImplementationDialogComponent } from './components/algorithms-implementations-list/dialogs/add-implementation-dialog/add-implementation-dialog.component';
import { ImplementationViewModule } from './components/implementation-view/implementation-view.module';

@NgModule({
  declarations: [
    AppComponent,
    AddImplementationDialogComponent,
    NavigationComponent,
    PageNotFoundComponent,
    AlgorithmsImplementationsListComponent,
  ],
  imports: [
    // NisqApi.forRoot({ rootUrl: environment.NISQ_API_URL }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ImplementationViewModule,
    KeycloakAngularModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ApiModule.forRoot({ rootUrl: environment.NISQ_API_URL }),
  ],
  providers: [
    UtilService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
