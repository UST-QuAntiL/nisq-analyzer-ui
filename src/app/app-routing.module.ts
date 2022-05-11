import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ImplementationSelectionCriteriaComponent } from './components/implementation-selection-criteria/implementation-selection-criteria.component';
import { QpuSelectionComponent } from './components/qpu-selection/qpu-selection.component';

const routes: Routes = [
  {
    path: 'selection-criteria',
    component: ImplementationSelectionCriteriaComponent,
  },
  {
    path: 'qpu-selection',
    component: QpuSelectionComponent,
  },
  {
    path: '',
    redirectTo: '/selection-criteria',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
