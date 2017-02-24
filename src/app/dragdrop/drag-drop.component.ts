import {
  Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit,
  NgZone, HostListener, Input, EventEmitter, Output, SimpleChange, OnChanges
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Board } from '../board/board';
import { BoardService } from '../board/board.service';
import { WorkspaceCanvas } from '../workspace-canvas';
import { BoardDetailsComponent } from '../board-details/board-details.component';
import { BoardConfig } from '../board-config';
import { Link } from '../link/link';

import { SketchService } from '../sketch/sketch.service';
import { Sketch } from '../sketch/sketch';

import { Point, PointInterface } from '../point';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class DragDropComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() operationMode: string;
  @Input() sketch: Sketch;
  @Output() onBoardSelected = new EventEmitter<BoardConfig>();
  @Output() onLinkSelected = new EventEmitter<Link>();
  @Output() onBoardDeselected = new EventEmitter<void>();
  @Output() onLinkDeselected = new EventEmitter<void>();
  @ViewChild('myCanvas') canvasRef: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private wsc: WorkspaceCanvas;
  private rect: ClientRect;
  private dragging = false;

  private linkSelected = false;
  private boardSelected = false;

  private canSelect = false;
  private linking = false;
  private selectedBoard: BoardConfig;
  private availableBoards: BoardConfig[];

  width = 600;
  height = 500;

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event) {
    event.preventDefault();
    this.wsc.resetCursorLocation();
    this.dragging = false;
    this.linking = false;
    this.canSelect = false;
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    event.preventDefault();
    let point = new Point(event.clientX - this.rect.left, event.clientY - this.rect.top);
    if (this.operationMode === 'Add' || ( this.operationMode === 'Drag' && this.dragging)) {
      this.wsc.updateCursorLocation(point.getX(), point.getY());
    }
    if ( this.operationMode === 'Drag' && !this.dragging) {
      if (this.wsc.checkPoint(point)) {
        this.canSelect = true;
      } else {
        this.canSelect = false;
      }
    }
    if (this.operationMode === 'Link' && this.linking) {
      this.wsc.updateLinking(point.getX(), point.getY());
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    event.preventDefault();
    let point = new Point(event.clientX - this.rect.left, event.clientY - this.rect.top);
    if (this.operationMode === 'Drag') {
      this.dragging = this.wsc.dragStart(point.getX(), point.getY());
    }
    if (this.operationMode === 'Select') {
      if (this.wsc.selectBoard(point.getX(), point.getY())) {
        this.selectBoard();
        this.deselectLink();
        return;
      } else if (this.wsc.selectLink(point)) {
        this.selectLink();
        this.deselectBoard();
        return;
      }
      this.deselectLink();
      this.deselectBoard();
    }
    if (this.operationMode === 'Link') {
      this.linking = this.wsc.linkStart(event.clientX - this.rect.left, event.clientY - this.rect.top);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    event.preventDefault();
    if (this.operationMode === 'Drag' && this.dragging) {
      this.wsc.dragEnd(event.clientX - this.rect.left, event.clientY - this.rect.top);
      this.dragging = false;
      // Avoid showing cursor after spill ( automatic reposition )
      if (this.wsc.findBoardAt(event.clientX - this.rect.left, event.clientY - this.rect.top)) {
        this.canSelect = true;
      } else {
        this.canSelect = false;
      }
    }
    if (this.operationMode === 'Link' && this.linking) {
      this.wsc.linkEnd(event.clientX - this.rect.left, event.clientY - this.rect.top);
      this.linking = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.refreshRect();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.refreshRect();
  }

  constructor(private ngZone: NgZone, private sketchService: SketchService,
                                      private route: ActivatedRoute,
                                      private boardService: BoardService ) {}

  ngOnInit(){
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.wsc = new WorkspaceCanvas(this.ctx, this.rect, this.width, this.height);
    this.loadSketch();
  }

  getSketch(id: number): void {
    this.sketchService.get(id).then( (sketch: Sketch) => {
      this.sketch = sketch;
      this.loadSketch();
      this.getAvailableBoards();
    });
  }

  getAvailableBoards():void {
    this.availableBoards = [];
    this.boardService.all().then( (boards: BoardConfig[]) => {
      for (let idx in boards) {
        let remove: boolean = false;
        for (let board of this.sketch.getBoards()) {
          if (boards[idx].getMac() === board.mac) {
            remove = true;
            break;
          }
        }
        if (!remove) this.availableBoards.push(boards[idx]);
      }
      console.log(this.availableBoards);
    });
  }

  ngAfterViewInit(): void{
    this.refreshRect();
    this.ngZone.runOutsideAngular(() => this.wsc.draw());
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['operationMode']) {
      this.deselectBoard();
      if (this.operationMode === 'Save') {
        this.sketch = this.wsc.buildSketch();
        this.sketchService.update( this.sketch );
      }
    }
    if (changes["sketch"]) {
      this.deselectLink();
      this.deselectBoard();
      if(typeof this.wsc !== "undefined")
        this.loadSketch()
      this.getAvailableBoards();
    }
  }

  refreshRect() {
    this.rect = this.canvasRef.nativeElement.getBoundingClientRect();
  }

  clicked(event): void {
    let selectedPoint: Point = new Point(event.clientX - this.rect.left, event.clientY - this.rect.top);
    if (this.operationMode === 'Add') {
      if(this.availableBoards.length > 0){
        const drawn = this.wsc.drawBoardAt(selectedPoint, this.availableBoards[0]);
        if(drawn)
          this.availableBoards.splice(0, 1);
      }
      console.log(this.availableBoards);
    } else if (this.operationMode === 'Delete') {
      // this.wsc.checkPoint(selectedPoint);
      let deletedBoard = this.wsc.deleteAtPoint(selectedPoint);
      if(deletedBoard)
        this.availableBoards.push(deletedBoard);
    }
  }

  selectLink(): void {
    this.linkSelected = true;
    this.onLinkSelected.emit(this.wsc.getSelectedLink());
  }

  deselectLink(): void {
    if( this.linkSelected ){
      this.linkSelected = false;
      this.wsc.deselectLink();
      this.onLinkDeselected.emit();
    }
  }

  selectBoard(): void {
    this.boardSelected = true;
    this.onBoardSelected.emit(this.wsc.getSelectedBoard());
  }

  deselectBoard(): void {
    if (this.boardSelected) {
      this.boardSelected = false;
      this.wsc.deselectBoard();
      this.onBoardDeselected.emit();
    }
  }

  loadSketch(): void {
    this.wsc.loadSketch(this.sketch);
  }

}
