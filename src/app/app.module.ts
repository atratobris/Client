import './rxjs-extensions';

import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DragDropComponent } from './dragdrop/drag-drop.component';
import { BoardDetailsComponent } from './board-details/board-details.component';

import { SketchService } from './sketch/sketch.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DragDropComponent,
    BoardDetailsComponent,
  ],
  imports: [
    BrowserModule,
    DragulaModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [SketchService],
  bootstrap: [AppComponent]
})
export class AppModule { }

