import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener, Input, SimpleChange, OnChanges } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Board } from '../board/board';
import { Link, LinkInterface } from '../link/link';
import { WorkspaceCanvas } from '../workspace-canvas';
import { BoardDetailsComponent } from '../board-details/board-details.component';
import { BoardConfig } from '../board-config';
import { BoardService } from '../board/board.service';
import { Sketch } from '../sketch/sketch';
import { SketchService } from '../sketch/sketch.service';

@Component({
  selector: 'app-sketch-editor',
  templateUrl: './sketch-editor.component.html',
  styleUrls: ['./sketch-editor.component.sass']
})
export class SketchEditorComponent implements OnInit, AfterViewInit {

  @Input() sketch: Sketch;
  private operationMode: string;
  private boardSelected = false;
  private linkSelected = false;
  private selectedLink: Link;
  private selectedBoard: BoardConfig;

  constructor(private ngZone: NgZone, private boardService: BoardService, private sketchService: SketchService) {}

  ngOnInit() {
    this.changeMode("Select");
  }

  ngOnChanges(changes: {[peropertyName: string]: SimpleChange}){
    if (changes["sketch"]) {
      this.onLinkDeselected();
      this.onBoardDeselected();
    }
  }

  ngAfterViewInit() {
  }

  clicked(event): void {
  }

  changeMode(operation: string): void {
    this.operationMode = operation;
    this.onLinkDeselected();
    this.onBoardDeselected();
  }

  onBoardSelected(selected_board: BoardConfig): void {
    this.boardService.get(selected_board.getMac()).then( (board: BoardConfig ) => {
      this.selectedBoard = board;
      this.boardSelected = true;
    });
  }

  onLinkSelected(link: Link): void{
    this.linkSelected = true;
    this.selectedLink = link;
  }

  onLinkSave(link: LinkInterface): void {
    let links = this.sketch.getLinks();
    console.log(links)
    for(var l of links){
      if(link["to"] === l["to"] && link["from"] === l["from"]){
        l.logic = link.logic;
        break;
      }
    }
    this.sketchService.updateLinks(this.sketch, links);

  }

  onLinkDeselected(): void {
    this.linkSelected = false;
    delete this.selectedLink;
  }
  onBoardDeselected(): void {
    this.boardSelected = false;
    delete this.selectedBoard;
  }

}
