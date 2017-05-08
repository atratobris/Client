import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { DragDropComponent } from './dragdrop/drag-drop.component';
import { SketchManagerComponent } from './sketch-manager/sketch-manager.component';
import { SketchEditorComponent } from './sketch-editor/sketch-editor.component';
import { LaptopComponent } from './laptop/laptop.component';
import { LaptopInputComponent } from './laptop/laptop-input/laptop-input.component';
import { LaptopOutputComponent } from './laptop/laptop-output/laptop-output.component';
import { LogsComponent } from './logs/logs.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { UserBoardsComponent } from './user-boards/user-boards.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './authentication/authentication.service';

const routes: Routes = [
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: 'home' , component: HomeComponent, canActivate: [AuthenticationService] },
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'dashboard', component:  SketchEditorComponent, canActivate: [AuthenticationService] },
  { path: 'laptop', component: LaptopComponent },
  { path: 'laptop-input', component: LaptopInputComponent },
  { path: 'laptop-output', component: LaptopOutputComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'myboards', component: UserBoardsComponent },
  { path: 'marketplace', component: MarketplaceComponent, canActivate: [AuthenticationService] },
  { path: 'sketches', component: SketchManagerComponent, canActivate: [AuthenticationService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
