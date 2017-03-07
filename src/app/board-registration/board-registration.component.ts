import { Component, OnInit } from '@angular/core';

import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-board-registration',
  templateUrl: './board-registration.component.html',
  styleUrls: ['./board-registration.component.sass']
})
export class BoardRegistrationComponent implements OnInit {

  constructor(private boardService: BoardService) { }

  ngOnInit() {
  }

  registerBoard(code: string): void {
    this.boardService.request_register(code);
  }

}
