import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';

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

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {

  }

}
