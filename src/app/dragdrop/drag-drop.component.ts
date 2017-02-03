import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Board } from '../board';
import { WorkspaceCanvas } from '../workspace-canvas';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class DragDropComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private wsc: WorkspaceCanvas;
  private rect: ClientRect;
  private boards: Board[];
  private operationMode: string;
  private dragging = false;
  private selected = false;
  private canSelect = false;

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
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
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    if (this.operationMode === 'Drag') {
      this.dragging = this.wsc.dragStart(event.clientX - this.rect.left, event.clientY - this.rect.top);
    }
    if (this.operationMode === 'Select') {
      this.selected = this.wsc.select(event.clientX - this.rect.left, event.clientY - this.rect.top);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
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
  }

  @HostListener('window:keydown', ['$event'])
  onkeyup(event: KeyboardEvent) {
    if ( this.operationMode === 'Select' && this.selected && event.keyCode === 8) {
      this.wsc.removeSelected();
      this.selected = false;
    }
  }

  constructor(private ngZone: NgZone) {}
  // constructor(private dragulaService: DragulaService) {
  //   console.log(dragulaService);
  //     dragulaService.setOptions('bag-one', {
  //       copy: true,
  //       accepts: (el, target, source, sibling) => {
  //         return !target.classList.contains('menu');
  //       }
  //     });
  // }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.operationMode = 'Add';
  }

  ngAfterViewInit() {
    this.rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.wsc = new WorkspaceCanvas(this.ctx, this.rect);
    this.ngZone.runOutsideAngular(() => this.wsc.draw());
  }

  clicked(event): void {
    if (this.operationMode === 'Add') {
      const drawn = this.wsc.drawAtPoint(event.clientX - this.rect.left, event.clientY - this.rect.top);
    } else if (this.operationMode === 'Delete') {
      this.wsc.deleteAtPoint(event.clientX - this.rect.left, event.clientY - this.rect.top);
    }
  }

  changeMode(operation: string): void {
    this.operationMode = operation;
    this.selected = false;
  }


}
