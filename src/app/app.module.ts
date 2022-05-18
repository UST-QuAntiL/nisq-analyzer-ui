import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ApiModule } from 'api-nisq/api.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ImplementationSelectionCriteriaComponent } from './components/implementation-selection-criteria/implementation-selection-criteria.component';
import { QpuSelectionComponent } from './components/qpu-selection/qpu-selection.component';
import { SelectInputComponent } from './components/generics/property-input/select-input.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PageNotFoundComponent,
    ImplementationSelectionCriteriaComponent,
    QpuSelectionComponent,
    SelectInputComponent,
  ],
  imports: [
    BrowserModule,
    ApiModule.forRoot({ rootUrl: environment.NISQ_API_URL }),
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
