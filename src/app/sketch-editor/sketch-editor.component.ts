import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef,
  AfterViewInit, NgZone, HostListener, Input, SimpleChange, OnChanges, OnDestroy } from '@angular/core';
import { Board } from '../board/board';
import { Link, LinkInterface } from '../link/link';
import { LinkService } from '../link/link.service';
import { WorkspaceCanvas } from '../workspace-canvas';
import { BoardDetailsComponent } from '../board-details/board-details.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
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

  private boardSelected = false;
  private linkSelected = false;
  private url: string = ENV.apiWs;

  public links: LinkOption[];
  public sketch: Sketch;
  public boards: BoardConfig[];
  public operationMode: string;
  public selectedLink: Link;
  public selectedBoard: BoardConfig;
  public newBoard: BoardConfig;
  public displayRealBoards: boolean;

  constructor(private ng2cable: Ng2Cable, private ngZone: NgZone,
            private boardService: BoardService, private sketchService: SketchService,
            private linkService: LinkService, private activatedRoute: ActivatedRoute,
            private router: Router) {
    this.ng2cable.setCable(this.url);
  }

  ngOnInit() {
    this.displayRealBoards = true;
    this.setSketch();
    this.linkService.all().then( ( links: LinkOption[] ) => {
      this.links = links;
    });
    this.changeMode('Select');
    this.refreshBoardData();
    this.ng2cable.subscription = this.ng2cable.cable.subscriptions
      .create({ channel: 'WatcherChannel', 'user_id': localStorage.getItem('atrato-user-id') }, {
        received: (data) => {
          this.activateBoard(data.message.mac);
        }
    });
  }

  showRealBoards(): void {
    this.displayRealBoards = true;
  }
  showVirtualBoards(): void {
    this.displayRealBoards = false;
  }

  setSketch(): void {
    this.activatedRoute.queryParams.subscribe( (params) => {
      const id = parseInt(params['sketch_id'], 10);
      this.sketchService.get(id).then( (activeSketch) => {
        this.sketch = activeSketch;
        this.markUsedBoards();
      });
    });
  }

  activateSketch(id: number): void {
    this.sketch.changeStatus('active');
    this.sketchService.updateStatus(this.sketch);
  }

  stopSketch(id: number): void {
    this.sketch.changeStatus('closed');
    this.sketchService.updateStatus(this.sketch);
  }

  ngOnDestroy() {
    this.ng2cable.unsubscribe();
  }

  ngOnChanges(changes: {[peropertyName: string]: SimpleChange}): void {
    if (changes['sketch']) {
      this.onLinkDeselected();
      this.onBoardDeselected();
      this.markUsedBoards();
    }
  }

  ngAfterViewInit() {
  }

  markUsedBoards(): void {
    if (!!this.boards && !!this.sketch) {
      const realBoards = this.boards.filter( board => board.getSubType() === 'RealBoard');
      const virtualBoards = this.boards.filter( board => board.getSubType() === 'VirtualBoard');
      for (const b of realBoards){
        b.used( b.inBoards(this.sketch.getBoards()) );
      }
      for (const b of virtualBoards){
        const count = this.sketch.getBoards().filter( board => board.getType() === b.getType() ).length;
        b.setCount(count);
      }
    }
  }

  onNameUpdated(newName): void {
    this.sketch.setName(newName);
    this.sketchService.update(this.sketch);
  }

  navigateToSketches(): void {
    this.router.navigate(['/sketches']);
  }

  private activateBoard(mac: string) {
    const b = this.sketch.getBoards().find((board) => board.getMac() === mac );
    if (!!b) { b.shake(); }

    const bc = this.boards.find((board) => board.getMac() === mac);
    if (!!bc) { bc.animate(); }
  }

  private refreshBoardData(): void {
    this.boardService.all('RealBoard').then( (boards: BoardConfig[]) => {
      this.boards = boards;
      this.markUsedBoards();
      this.boardService.all('VirtualBoard').then( (bs: BoardConfig[]) => {
        if (!!this.boards) { this.boards = bs.concat(this.boards); }
      });
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
    if (this.operationMode !== 'Add') { this.newBoard = null; }
  }

  onBoardSelected(selected_board: BoardConfig): void {
    this.selectedBoard = selected_board;
    this.boardSelected = true;
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
    this.onLinkDeselected();
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
    this.changeMode('Select');
    this.sketchService.get(this.sketch.getId()).then( (activeSketch) => {
      this.sketch = activeSketch;
      this.markUsedBoards();
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
    this.changeMode('Add');
    this.newBoard = board.newBoard(this.sketch.getBoardConfigs());
    this.onBoardSelected(board);
  }

  onFinishedAddingBoard(): void {
    this.newBoard = null;
    this.changeMode('Select');
    this.markUsedBoards();
  }

  onFinishedDeletingBoard(): void {
    this.markUsedBoards();
  }
}
