import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DragDropComponent } from './dragdrop/drag-drop.component';
import { SketchManagerComponent } from './sketch-manager/sketch-manager.component';
import { SketchEditorComponent } from './sketch-editor/sketch-editor.component';
import { LaptopComponent } from './laptop/laptop.component';
import { LogsComponent } from './logs/logs.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { BoardRegistrationComponent } from './board-registration/board-registration.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component:  SketchManagerComponent },
  { path: 'laptop', component: LaptopComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'registerboard', component: BoardRegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
