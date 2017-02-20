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
  @Output() onSelected = new EventEmitter<BoardConfig>();
  @Output() onDeselected = new EventEmitter<void>();
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() sketchId: number;
  private ctx: CanvasRenderingContext2D;
  private wsc: WorkspaceCanvas;
  private rect: ClientRect;
  private dragging = false;
  private selected = false;
  private canSelect = false;
  private linking = false;
  private selectedBoard: BoardConfig;
  private availableBoards: BoardConfig[];

  private sketch: Sketch;

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
    if (this.operationMode === 'Add' || ( this.operationMode === 'Drag' && this.dragging)) {
      this.wsc.updateCursorLocation(event.clientX - this.rect.left, event.clientY - this.rect.top);
    }
    if ( this.operationMode === 'Drag' && !this.dragging) {
      if (this.wsc.findAtPoint(event.clientX - this.rect.left, event.clientY - this.rect.top)) {
        this.canSelect = true;
      } else {
        this.canSelect = false;
      }
    }
    if (this.operationMode === 'Link' && this.linking) {
      this.wsc.updateLinking(event.clientX - this.rect.left, event.clientY - this.rect.top);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    event.preventDefault();
    if (this.operationMode === 'Drag') {
      this.dragging = this.wsc.dragStart(event.clientX - this.rect.left, event.clientY - this.rect.top);
    }
    if (this.operationMode === 'Select' || this.operationMode === "LinkRemove") {
      if (this.wsc.select(event.clientX - this.rect.left, event.clientY - this.rect.top)) {
        this.select();
      } else {
        this.deselect();
      }
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
      if (this.wsc.findAtPoint(event.clientX - this.rect.left, event.clientY - this.rect.top)) {
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

  // @HostListener('window:keydown', ['$event'])
  // onkeyup(event: KeyboardEvent) {
  //   if ( this.operationMode === 'Select' && this.selected && event.keyCode === 8) {
  //     this.wsc.removeSelected();
  //     this.selected = false;
  //     delete this.selectedBoard;
  //   }
  // }

  constructor(private ngZone: NgZone, private sketchService: SketchService,
                                      private route: ActivatedRoute,
                                      private boardService: BoardService ) {}

  ngOnInit(){
    this.getSketch(this.sketchId);
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.wsc = new WorkspaceCanvas(this.ctx, this.rect, this.width, this.height);
  }

  getSketch(id: number): void {
    this.sketchService.get(id).then( (sketch: Sketch) => {
      this.sketch = sketch;
      this.loadSketch();
      this.getAvailableBoards();
    });
  }

  getAvailableBoards():void {
    this.availableBoards = this.availableBoards || [];
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
    });
  }

  ngAfterViewInit(): void{
    this.refreshRect();
    this.ngZone.runOutsideAngular(() => this.wsc.draw());
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['operationMode']) {
      this.deselect();
      if (this.operationMode === 'Save') {
        this.sketch = this.wsc.buildSketch();
        this.sketchService.update( this.sketch );
      }
    }
    if (changes["sketchId"]) {
      this.getSketch(this.sketchId)
    }
  }

  refreshRect() {
    this.rect = this.canvasRef.nativeElement.getBoundingClientRect();
  }

  clicked(event): void {
    if (this.operationMode === 'Add') {
      if(this.availableBoards.length > 0) {
        const drawn = this.wsc.drawBoardAt(event.clientX - this.rect.left, event.clientY - this.rect.top, this.availableBoards[0]);
        if(drawn)
          this.availableBoards.splice(0, 1);
      }
    } else if (this.operationMode === 'Delete') {
      let deletedBoard = this.wsc.deleteAtPoint(event.clientX - this.rect.left, event.clientY - this.rect.top);
      if(deletedBoard)
        this.availableBoards.push(deletedBoard);
    }
  }

  changeMode(operation: string): void {
    this.operationMode = operation;
    this.deselect();
  }

  select(): void {
    this.selected = true;
    this.onSelected.emit(this.wsc.getSelectedBoard());
  }

  deselect(): void {
    if (this.selected) {
      this.selected = false;
      this.wsc.deselect();
      this.onDeselected.emit();
    }
  }

  loadSketch(): void {
    console.log(this.sketch);
    this.wsc.loadSketch(this.sketch);
  }

}
