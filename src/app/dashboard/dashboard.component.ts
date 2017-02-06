import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Board } from '../board';
import { WorkspaceCanvas } from '../workspace-canvas';
import { BoardDetailsComponent } from '../board-details/board-details.component';
import { BoardConfig } from '../board-config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private wsc: WorkspaceCanvas;
  private rect: ClientRect;
  private boards: Board[];
  private operationMode: string;
  private dragging = false;
  private selected = false;
  private canSelect = false;
  private selectedBoard: BoardConfig;

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
    // this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.operationMode = 'Select';
  }

  ngAfterViewInit() {
    // this.rect = this.canvasRef.nativeElement.getBoundingClientRect();
    // this.wsc = new WorkspaceCanvas(this.ctx, this.rect, this.width, this.height);
    // this.ngZone.runOutsideAngular(() => this.wsc.draw());
  }

  clicked(event): void {
    // if (this.operationMode === 'Add') {
    //   const drawn = this.wsc.drawAtPoint(event.clientX - this.rect.left, event.clientY - this.rect.top);
    // } else if (this.operationMode === 'Delete') {
    //   this.wsc.deleteAtPoint(event.clientX - this.rect.left, event.clientY - this.rect.top);
    // }
  }

  changeMode(operation: string): void {
    this.operationMode = operation;
    this.selected = false;
  }

  onSelected(board: BoardConfig): void {
    this.selectedBoard = board;
  }

  onDeselected(): void {
    delete this.selectedBoard;
  }


}
