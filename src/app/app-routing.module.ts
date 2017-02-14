import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SketchManagerComponent } from './sketch-manager/sketch-manager.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/sketch', component:  SketchManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
