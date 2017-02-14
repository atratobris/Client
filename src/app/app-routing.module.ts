import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DragDropComponent } from './dragdrop/drag-drop.component';
import { SketchManagerComponent } from './sketch-manager/sketch-manager.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/sketch', component:  SketchManagerComponent },
  { path: 'dashboard/sketch/:id', component: DragDropComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
