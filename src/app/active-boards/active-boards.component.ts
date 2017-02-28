import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BoardConfig } from '../board-config';

@Component({
  selector: 'app-active-boards',
  templateUrl: './active-boards.component.html',
  styleUrls: ['./active-boards.component.sass']
})
export class ActiveBoardsComponent {
  @Input() boards: BoardConfig[];
  @Input() selectedBoard: BoardConfig;
  @Output() boardSelectedEmitter = new EventEmitter();

  constructor() { }

  onBoardSelected(board: BoardConfig): void {
    this.boardSelectedEmitter.emit(board);
  }

}
