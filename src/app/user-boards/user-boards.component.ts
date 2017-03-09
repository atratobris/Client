import { Component, OnInit } from '@angular/core';

import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-user-boards',
  templateUrl: './user-boards.component.html',
  styleUrls: ['./user-boards.component.sass']
})
export class UserBoardsComponent implements OnInit {

  public code: string;

  constructor(private boardService: BoardService) { }

  ngOnInit() {
  }

  registerBoard(): void {
    this.boardService.request_register(this.code);
  }

}
