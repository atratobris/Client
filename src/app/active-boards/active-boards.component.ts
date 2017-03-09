import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BoardConfig } from '../board-config';

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

  private default_config = {
    'class': 'col-12',
    'unregistrable': false
  };

  public configuration: {[key: string]: any};

  constructor() {
    this.configuration = {};
    Object.assign(this.configuration, this.default_config);
  }

  ngOnInit(): void {
    Object.assign(this.configuration, this.config);

  }
  onBoardSelected(board: BoardConfig): void {
    this.boardSelectedEmitter.emit(board);
  }

  onDeregisterBoard(board: BoardConfig): void {
    this.boardDeregisterEmitter.emit(board);
  }

}
