import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef,
  AfterViewInit, NgZone, HostListener, Input, SimpleChange, OnChanges } from '@angular/core';
import { Board } from '../board/board';
import { Link, LinkInterface } from '../link/link';
import { WorkspaceCanvas } from '../workspace-canvas';
import { BoardDetailsComponent } from '../board-details/board-details.component';
import { BoardConfig } from '../board-config';
import { BoardService } from '../board/board.service';
import { Sketch } from '../sketch/sketch';
import { SketchService } from '../sketch/sketch.service';
import { LinkOption } from '../link/link';

@Component({
  selector: 'app-sketch-editor',
  templateUrl: './sketch-editor.component.html',
  styleUrls: ['./sketch-editor.component.sass']
})
export class SketchEditorComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() sketch: Sketch;
  @Input() boards: BoardConfig[];
  @Input() links: LinkOption[];
  public operationMode: string;
  private boardSelected = false;
  private linkSelected = false;
  public selectedLink: Link;
  public selectedBoard: BoardConfig;
  public newBoard: BoardConfig;

  constructor(private ngZone: NgZone, private boardService: BoardService, private sketchService: SketchService) {}

  ngOnInit() {
    this.changeMode('Select');
  }

  ngOnChanges(changes: {[peropertyName: string]: SimpleChange}): void {
    if (changes['sketch']) {
      this.onLinkDeselected();
      this.onBoardDeselected();
    }
  }

  ngAfterViewInit() {
  }

  clicked(event): void {
    this.sketch.setBoards([]);
  }

  changeMode(operation: string): void {
    if (this.operationMode === operation ) {
      delete this.operationMode;
    } else {
      this.operationMode = operation;
    }
    this.onLinkDeselected();
    this.onBoardDeselected();
    if (this.operationMode !== 'Add') {
      this.newBoard = null;
    }
  }

  onBoardSelected(selected_board: BoardConfig): void {
    this.boardService.get(selected_board.getMac()).then( (board: BoardConfig ) => {
      this.selectedBoard = board;
      this.boardSelected = true;
    });
  }

  onLinkSelected(link: Link): void {
    this.linkSelected = true;
    this.selectedLink = link;
  }

  onLinkSave(link: LinkInterface): void {
    const links = this.sketch.getLinks();
    for (const l of links) {
      if (link['to'] === l['to'] && link['from'] === l['from']) {
        l.logic = link.logic;
        break;
      }
    }
    this.sketchService.updateLinks(this.sketch, links);
  }

  revertToActive(): void {
    this.sketchService.get(this.sketch.getId()).then( (activeSketch) => {
      this.sketch = activeSketch;
    });
  }

  onLinkDeselected(): void {
    this.linkSelected = false;
    delete this.selectedLink;
  }
  onBoardDeselected(): void {
    this.boardSelected = false;
    delete this.selectedBoard;
  }

  onActiveBoardSelected(board: BoardConfig): void {
    this.newBoard = board;
    this.changeMode('Add');
  }

  onFinishedAddingBoard(): void {
    this.newBoard = null;
    this.changeMode('Select');
  }

  listOnMarketplace(): void {
    this.sketch.listed = true;
    this.sketchService.update(this.sketch).then( (sketch) => this.sketch = sketch );
  }
}
