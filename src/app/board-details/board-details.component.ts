import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { BoardConfig } from '../board-config';

@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.sass']
})
export class BoardDetailsComponent implements OnInit, OnChanges {
  @Input() board: BoardConfig;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    // console.log(this.board);
  }

}
