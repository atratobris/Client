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

  ngOnInit() {
    this.operationMode = 'Select';
  }

  ngAfterViewInit() {
  }

  clicked(event): void {
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
