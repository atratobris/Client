
import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef,
  AfterViewInit, NgZone, HostListener, Input, SimpleChange, OnChanges, OnDestroy } from '@angular/core';
import { Board } from '../board/board';
import { Link, LinkInterface } from '../link/link';
import { WorkspaceCanvas } from '../workspace-canvas';
import { BoardDetailsComponent } from '../board-details/board-details.component';
import { BoardConfig } from '../board-config';
import { BoardService } from '../board/board.service';
import { Sketch } from '../sketch/sketch';
import { SketchService } from '../sketch/sketch.service';
import { LinkOption } from '../link/link';
import { Ng2Cable } from 'ng2-cable/js/index';
import { ENV } from '../../environments/environment';

@Component({
  selector: 'app-sketch-editor',
  templateUrl: './sketch-editor.component.html',
  styleUrls: ['./sketch-editor.component.sass']
})
export class SketchEditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() sketch: Sketch;
  @Input() links: LinkOption[];
  private boardSelected = false;
  private linkSelected = false;
  private url: string = ENV.apiWs;

  public boards: BoardConfig[];
  public operationMode: string;
  public selectedLink: Link;
  public selectedBoard: BoardConfig;
  public newBoard: BoardConfig;

  constructor(private ng2cable: Ng2Cable, private ngZone: NgZone,
            private boardService: BoardService, private sketchService: SketchService) {
    this.ng2cable.setCable(this.url);
  }

  ngOnInit() {
    this.changeMode('Select');
    this.refreshBoardData();
    this.ng2cable.subscription = this.ng2cable.cable.subscriptions
      .create({ channel: 'WatcherChannel', 'user_id': localStorage.getItem('atrato-user-id') }, {
        received: (data) => {
          this.activateBoard(data.message.mac);
        }
    });
  }

  ngOnDestroy() {
    this.ng2cable.unsubscribe();
  }

  ngOnChanges(changes: {[peropertyName: string]: SimpleChange}): void {
    if (changes['sketch']) {
      this.onLinkDeselected();
      this.onBoardDeselected();
    }
  }

  ngAfterViewInit() {
  }

  private activateBoard(mac: string) {
    const b = this.sketch.getBoards().find((board) => board.getMac() === mac );
    if (!!b) { b.shake(); }

    const bc = this.boards.find((board) => board.getMac() === mac);
    if (!!bc) { bc.animate(); }

  }

  private refreshBoardData(): void {
    this.boardService.all().then( (boards: BoardConfig[]) => {
      this.boards = boards;
    });
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
    delete this.operationMode;
  }

  onLinkSave(link: LinkInterface): void {
    const links = this.sketch.getLinks();
    for (const l of links) {
      if (link['to'] === l['to'] && link['from'] === l['from']) {
        l.setLogic( link.logic );
        break;
      }
    }
    this.sketchService.updateLinks(this.sketch, links);
  }

  onBoardSave(b: BoardConfig): void {
    this.boardService.update(b);
    for (const board of this.boards) {
      if (board.getMac() === b.getMac()) {
        board.setName(b.getName());
      }
    }
    for (const board of this.sketch.getBoardConfigs()) {
      if (board.getMac() === b.getMac()) {
        board.setName(b.getName());
      }
    }
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
}
