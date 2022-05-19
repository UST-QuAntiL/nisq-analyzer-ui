import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ImplementationSelectionCriteriaComponent } from './components/implementation-selection-criteria/implementation-selection-criteria.component';
import { QpuSelectionComponent } from './components/qpu-selection/qpu-selection.component';
import { AlgorithmsImplementationsListComponent } from './components/algorithms-implementations-list/algorithms-implementations-list.component';

const routes: Routes = [
  {
    path: 'algorithms',
    component: AlgorithmsImplementationsListComponent,
  },
  {
    path: 'algorithms/:algoId/implementations/:implId/selection-criteria',
    component: ImplementationSelectionCriteriaComponent,
  },
  {
    path: 'algorithms/:algoId/implementations/:implId/qpu-selection',
    component: QpuSelectionComponent,
  },
  {
    path: '',
    redirectTo: '/algorithms',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
