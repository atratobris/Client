import './rxjs-extensions';

import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { SketchEditorComponent } from './sketch-editor/sketch-editor.component';
import { DragDropComponent } from './dragdrop/drag-drop.component';
import { BoardDetailsComponent } from './board-details/board-details.component';
import { SketchManagerComponent } from './sketch-manager/sketch-manager.component';

import { SketchService } from './sketch/sketch.service';
import { BoardService } from './board/board.service';


@NgModule({
  declarations: [
    AppComponent,
    SketchEditorComponent,
    DragDropComponent,
    BoardDetailsComponent,
    SketchManagerComponent,
  ],
  imports: [
    BrowserModule,
    DragulaModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [SketchService, BoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
