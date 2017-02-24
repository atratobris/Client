import { Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { BoardConfig } from '../board-config';
import { BoardService } from '../board/board.service';
import { Link, LinkInterface } from '../link/link';
import { Sketch } from '../sketch/sketch';
import { SketchService } from '../sketch/sketch.service';

@Component({
  selector: 'board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.sass']
})

export class BoardDetailsComponent implements OnInit, OnChanges {
  @Input() board: BoardConfig;
  @Input() link: Link;
  @Input() sketch: Sketch;
  @Output() onLinkSave = new EventEmitter<LinkInterface>();

  constructor(private boardService: BoardService, private sketchService: SketchService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
  }

  updateLink(link): void {
    console.log("triggering link save")
    this.onLinkSave.emit(link.prepare());
  }

  updateBoard(board: BoardConfig): void {
    this.boardService.update(board);
  }

}
