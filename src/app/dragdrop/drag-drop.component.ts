import {
  Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit,
  NgZone, HostListener, Input, EventEmitter, Output, SimpleChange, OnChanges
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
  @Input() newBoard: BoardConfig;
  @Output() onBoardSelected = new EventEmitter<BoardConfig>();
  @Output() onLinkSelected = new EventEmitter<Link>();
  @Output() onBoardDeselected = new EventEmitter<void>();
  @Output() onLinkDeselected = new EventEmitter<void>();
  @Output() finishedAddingBoard = new EventEmitter();
  @Output() finishedDeletingBoard = new EventEmitter();
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @ViewChild('myCanvasContainer') canvasContainerRef: ElementRef;
  dragging = false;
  canSelect = false;
  private ctx: CanvasRenderingContext2D;
  private wsc: WorkspaceCanvas;
  private rect: ClientRect;

  private linkSelected = false;
  private boardSelected = false;

  private linking = false;
  private selectedBoard: BoardConfig;
  private availableBoards: BoardConfig[];

  private mouseDown = false;
  private mouseUp = false;


  private fullWidthX = 1600;
  private fullWidthY = 900;

  private scaleFactor: number;

  width = 990;
  height = 600;

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event) {
    event.preventDefault();
    if (!!this.newBoard && this.operationMode === 'Add') {
      const point = new Point((event.clientX - this.rect.left) / this.scaleFactor, (event.clientY - this.rect.top) / this.scaleFactor);
      this.wsc.setCursor(new Board(point.getX(), point.getY(), 160 / this.scaleFactor, 160 / this.scaleFactor, this.newBoard));
    }
  }

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
    const point = new Point((event.clientX - this.rect.left) / this.scaleFactor, (event.clientY - this.rect.top) / this.scaleFactor);
    if (this.operationMode === 'Add' || ( this.mouseDown && this.dragging)) {
      this.wsc.updateCursorLocation(point.getX(), point.getY());
    }
    if ( this.mouseDown && !this.dragging) {
      this.canSelect = this.wsc.checkPoint(point);
    }
    if (this.operationMode === 'Link' && this.linking) {
      this.wsc.updateLinking(point.getX(), point.getY());
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    event.preventDefault();
    const point = new Point((event.clientX - this.rect.left) / this.scaleFactor, (event.clientY - this.rect.top) / this.scaleFactor);
    this.mouseDown = true;
    if (this.operationMode === 'Link') {
      this.linking = this.wsc.linkStart(point.getX(), point.getY());
      return;
    }
    if (this.operationMode === 'Delete') {
      if (this.wsc.checkPoint(point)) {
        if ( this.wsc.findBoardAt(point.getX(), point.getY()) ) {
          const deletedBoard = this.wsc.deleteAtPoint(point);
          if (deletedBoard) {
            this.availableBoards.push(deletedBoard);
            this.finishedDeletingBoard.emit();
          }
        } else {
          this.wsc.removeLinkNextToPoint(point);
        }
      } else {
        this.finishedAddingBoard.emit();
      }
    }

    if (this.wsc.selectBoard(point.getX(), point.getY())) {
      this.dragging = this.wsc.dragStart(point.getX(), point.getY());
      this.selectBoard();
      this.deselectLink();
      return;
    }
    if (this.wsc.selectLink(point)) {
      this.selectLink();
      this.deselectBoard();
      return;
    }

    this.deselectLink();
    this.deselectBoard();

  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    event.preventDefault();
    this.mouseUp = false;
    const point = new Point((event.clientX - this.rect.left) / this.scaleFactor, (event.clientY - this.rect.top) / this.scaleFactor);
    if (this.dragging) {
      this.wsc.dragEnd(point.getX(), point.getY());
      this.dragging = false;
      this.canSelect = this.wsc.checkPoint(point);
    }
    if (this.operationMode === 'Link' && this.linking) {
      const link_success = this.wsc.linkEnd(point.getX(), point.getY());
      this.linking = false;
      if (link_success) {
        this.selectLink();
      }
    }
    if (this.operationMode === 'Add') {
      this.clicked(event);
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

  @HostListener('window:keydown', ['$event'])
  onKeyUp(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.stopPropagation();
      event.preventDefault();
      this.saveSketch();
    }
  }

  constructor(private ngZone: NgZone, private sketchService: SketchService,
                                      private route: ActivatedRoute,
                                      private boardService: BoardService ) {}

  ngOnInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.wsc = new WorkspaceCanvas(this.ctx, this.rect, this.width, this.height);
    this.refreshRect();
    this.loadSketch();
  }

  getAvailableBoards(): void {
    this.availableBoards = [];
    this.boardService.all('RealBoard').then( (boards: BoardConfig[]) => {
      for (let idx = 0; idx < boards.length; idx++) {
        let remove = false;
        for (const board of this.sketch.getBoards()) {
          if (boards[idx].getMac() === board.getMac()) {
            remove = true;
            break;
          }
        }
        if (!remove) {
          this.availableBoards.push(boards[idx]);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.refreshRect();
    this.ngZone.runOutsideAngular(() => this.wsc.draw());
  }

  saveSketch(): void {
    this.sketch = this.wsc.buildSketch();
    this.sketchService.update( this.sketch );
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['operationMode']) {
      this.deselectBoard();
    }
    if (changes['sketch']) {
      this.deselectLink();
      this.deselectBoard();
      if (typeof this.wsc !== 'undefined') {
        this.loadSketch();
      }
      this.getAvailableBoards();
    }

    if (this.operationMode === 'Add' && changes['newBoard']) {
      this.wsc.setCursor(
        new Board(-100 / this.scaleFactor, -100 / this.scaleFactor, 160 / this.scaleFactor, 160 / this.scaleFactor, this.newBoard)
      );
    }
  }

  refreshRect() {
    this.width = this.canvasContainerRef.nativeElement.clientWidth;
    this.height = this.canvasContainerRef.nativeElement.clientHeight;
    this.canvasRef.nativeElement.width = this.width;
    this.canvasRef.nativeElement.height = this.height;

    this.scaleFactor = this.width / this.fullWidthX;
    this.rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.wsc.refreshRect(this.rect, this.width, this.height, this.scaleFactor);
  }

  clicked(event): void {
    const selectedPoint: Point = new Point(
      (event.clientX - this.rect.left) / this.scaleFactor, (event.clientY - this.rect.top) / this.scaleFactor
    );
    if (this.operationMode === 'Add') {
      if (!this.newBoard.in_use()) {
        const drawn = this.wsc.drawBoardAt(selectedPoint, this.newBoard);
        if (drawn) {
          this.availableBoards.splice(0, 1);
        }
      }
      this.finishedAddingBoard.emit();
      this.wsc.setCursor(null);
    }
  }

  selectLink(): void {
    this.linkSelected = true;
    this.onLinkSelected.emit(this.wsc.getSelectedLink());
  }

  deselectLink(): void {
    if ( this.linkSelected ) {
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
