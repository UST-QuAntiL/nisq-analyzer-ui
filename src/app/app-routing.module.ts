import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AlgorithmsImplementationsListComponent } from './components/algorithms-implementations-list/algorithms-implementations-list.component';
import { ImplementationViewComponent } from './components/implementation-view/implementation-view.component';

const routes: Routes = [
  {
    path: 'algorithms',
    component: AlgorithmsImplementationsListComponent,
  },
  {
    path: 'algorithms/:algoId/implementations/:implId',
    component: ImplementationViewComponent,
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
