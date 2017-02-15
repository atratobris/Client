import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DragDropComponent } from './dragdrop/drag-drop.component';
import { SketchManagerComponent } from './sketch-manager/sketch-manager.component';
import { SketchEditorComponent } from './sketch-editor/sketch-editor.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/sketch', pathMatch: 'full' },
  { path: 'dashboard', component: SketchEditorComponent },
  { path: 'dashboard/sketch', component:  SketchManagerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
