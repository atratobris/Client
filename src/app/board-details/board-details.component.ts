import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';

import { BoardConfig } from '../board-config';
import { BoardService } from '../board/board.service';

import { Link } from '../link/link';

@Component({
  selector: 'board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.sass']
})

export class BoardDetailsComponent implements OnInit, OnChanges {
  @Input() board: BoardConfig;
  @Input() link: Link;

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {

  }

  updateBoard(board: BoardConfig): void {
    this.boardService.update(board);
  }

  updateLink(link: Link): void {
  }

}
