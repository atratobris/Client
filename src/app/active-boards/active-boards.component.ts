import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BoardConfig } from '../board-config';

@Component({
  selector: 'app-active-boards',
  templateUrl: './active-boards.component.html',
  styleUrls: ['./active-boards.component.sass']
})
export class ActiveBoardsComponent {
  @Input()
  boards: BoardConfig[];

  constructor() { }

}
