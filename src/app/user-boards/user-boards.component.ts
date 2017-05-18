import { Component, OnInit } from '@angular/core';

import { BoardService } from '../board/board.service';
import { BoardConfig } from '../board-config';


@Component({
  selector: 'app-user-boards',
  templateUrl: './user-boards.component.html',
  styleUrls: ['./user-boards.component.sass']
})
export class UserBoardsComponent implements OnInit {

  public code: string;
  public boards: BoardConfig[];
  private active_board_config: {[key: string]: any} = {
    'class': 'col-6 col-sm-3 col-md-2',
    'unregisterable': true,
  };

  constructor(private boardService: BoardService) { }

  ngOnInit() {
    this.boardService.all('RealBoard').then( (boards: BoardConfig[] ) => {
      this.boards = boards;
    });
  }

  registerBoard(): void {
    this.boardService.request_register(this.code);
  }

  getActiveBoardsConfig(): {[key: string]: any} {
    return this.active_board_config;
  }

  deregisterBoard(board: BoardConfig): void {
    this.boardService.deregister(board).then((b: BoardConfig) => {
      if (board.mac === b.mac) {
        const idx = this.boards.indexOf(board);
        this.boards.splice(idx, 1);
      }
    });
  }

}
