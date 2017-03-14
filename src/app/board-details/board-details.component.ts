import { Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { BoardConfig } from '../board-config';
import { BoardService } from '../board/board.service';
import { Link, LinkInterface, LinkOption } from '../link/link';
import { Sketch } from '../sketch/sketch';
import { SketchService } from '../sketch/sketch.service';
import { CodeService } from '../link/code.service';
import { Code } from '../link/code';

@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.sass']
})

export class BoardDetailsComponent implements OnInit, OnChanges {
  @Input() board: BoardConfig;
  @Input() link: Link;
  @Input() sketch: Sketch;
  @Input() linkOptions: LinkOption[];
  @Output() onBoardSave = new EventEmitter<BoardConfig>();
  @Output() onLinkSave = new EventEmitter<LinkInterface>();
  codeSnippets: Code[];

  constructor(private codeService: CodeService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (this.link) {
      console.log(this.linkTypes(this.link));
      this.codeService.all("Led", this.linkTypes(this.link)).then( (codeSnippets: Code[]) => {
        console.log(codeSnippets);
      })
    }
  }

  updateLink(link): void {
    this.onLinkSave.emit(link.prepare());
  }

  updateBoard(board: BoardConfig): void {
    this.onBoardSave.emit(board);
  }

  private linkTypes(link: Link): string[] {
    return link
      .getEndBoard()
      .getBoardConfig()
      .getAcceptedLinks()
      .map((link) => link.getName());
  }

}
