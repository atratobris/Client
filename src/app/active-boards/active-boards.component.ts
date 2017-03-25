import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BoardConfig } from '../board-config';
import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-active-boards',
  templateUrl: './active-boards.component.html',
  styleUrls: ['./active-boards.component.sass']
})
export class ActiveBoardsComponent implements OnInit {
  @Input() boards: BoardConfig[];
  @Input() selectedBoard: BoardConfig;
  @Input() config: {[key: string]: any};
  @Output() boardSelectedEmitter = new EventEmitter();
  @Output() boardDeregisterEmitter = new EventEmitter();
  @Output() onBoardSave = new EventEmitter<BoardConfig>();

  private default_config = {
    'class': 'col-12',
    'unregisterable': false
  };

  public configuration: {[key: string]: any};

  constructor(private boardService: BoardService) {
    this.configuration = {};
    Object.assign(this.configuration, this.default_config);
  }

  ngOnInit(): void {
    Object.assign(this.configuration, this.config);
  }

  onNameUpdated(newName, board: BoardConfig): void {
    board.setName(newName);
    this.onBoardSave.emit(board);
  }

  onBoardSelected(board: BoardConfig): void {
    console.log("clicked on board");
    if (!board.in_use()) {
      this.boardSelectedEmitter.emit(board);
    }
  }

  onDeregisterBoard(board: BoardConfig): void {
    this.boardDeregisterEmitter.emit(board);
  }

}
