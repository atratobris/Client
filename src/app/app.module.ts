import './rxjs-extensions';

import { BrowserModule } from '@angular/platform-browser';
import { Ng2Cable, Broadcaster } from 'ng2-cable/js/index';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { DasherizePipe } from './pipes/dasherize.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

import { AppComponent } from './app.component';
import { SketchEditorComponent } from './sketch-editor/sketch-editor.component';
import { DragDropComponent } from './dragdrop/drag-drop.component';
import { BoardDetailsComponent } from './board-details/board-details.component';
import { SketchManagerComponent } from './sketch-manager/sketch-manager.component';

import { SketchService } from './sketch/sketch.service';
import { AuthenticationService } from './authentication/authentication.service';
import { LinkService } from './link/link.service';
import { BoardService } from './board/board.service';
import { CodeService } from './link/code.service';
import { ActiveBoardsComponent } from './active-boards/active-boards.component';
import { LaptopComponent } from './laptop/laptop.component';
import { LaptopInputComponent } from './laptop/laptop-input/laptop-input.component';
import { LaptopOutputComponent } from './laptop/laptop-output/laptop-output.component';

import { ClickToEditComponent } from './click-to-edit/click-to-edit.component';
import { LogsComponent } from './logs/logs.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { UserBoardsComponent } from './user-boards/user-boards.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';

import { VirtualBoardsPipe, RealBoardsPipe } from './board-config.pipe';

import { ImageService } from './image.service';


@NgModule({
  declarations: [
    AppComponent,
    SketchEditorComponent,
    DragDropComponent,
    BoardDetailsComponent,
    SketchManagerComponent,
    ActiveBoardsComponent,
    LaptopComponent,
    LaptopInputComponent,
    LaptopOutputComponent,
    ClickToEditComponent,
    LogsComponent,
    CapitalizePipe,
    DasherizePipe,
    TruncatePipe,
    MarketplaceComponent,
    UserBoardsComponent,
    AuthenticationComponent,
    VirtualBoardsPipe,
    RealBoardsPipe,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [SketchService, BoardService, Ng2Cable, Broadcaster, LinkService, AuthenticationService, CodeService, ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
