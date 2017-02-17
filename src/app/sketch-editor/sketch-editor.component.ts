import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener, Input, SimpleChange, OnChanges } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Board } from '../board/board';
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

  @Input() sketchId: number;
  private operationMode: string;
  private selected = false;
  private selectedBoard: BoardConfig;

  constructor(private ngZone: NgZone, private boardService: BoardService, private sketchService: SketchService) {}

  ngOnInit() {

  }

  ngOnChanges(changes: {[peropertyName: string]: SimpleChange}){

  }

  ngAfterViewInit() {
  }

  clicked(event): void {
  }

  changeMode(operation: string): void {
    this.operationMode = operation;
    this.selected = false;
  }

  onSelected(selected_board: BoardConfig): void {
    this.boardService.get(selected_board.getMac()).then( (board: BoardConfig ) => {
      this.selectedBoard = board;
      this.selected = true;
    });
  }

  onDeselected(): void {
    this.selected = false;
  }

}
