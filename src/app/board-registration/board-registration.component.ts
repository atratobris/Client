import { Component, OnInit } from '@angular/core';

import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-board-registration',
  templateUrl: './board-registration.component.html',
  styleUrls: ['./board-registration.component.sass']
})
export class BoardRegistrationComponent implements OnInit {

  public code: string;

  constructor(private boardService: BoardService) { }

  ngOnInit() {
  }

  registerBoard(): void {
    this.boardService.request_register(this.code);
  }

}
