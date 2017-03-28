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
  code: string;

  constructor(private codeService: CodeService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (this.link) {
      this.codeService.all('Led', this.linkTypes(this.link)).then( (codeSnippets: Code[]) => {
        this.codeSnippets = codeSnippets;
        this.code = this.renderCodeSnippet();
      });
    }
  }

  updateLink(link): void {
    this.onLinkSave.emit(link.prepare());
  }

  updateBoard(board: BoardConfig): void {
    this.onBoardSave.emit(board);
  }

  renderCodeSnippet(): string {
    for (const code of this.codeSnippets) {
      if (code.getName() === this.link.getLogic()) {
        const raw_code = code.getCode();
        const code_header = raw_code.match(/def [A-Z_]+(.+)/gi)[0];
        const params = code_header.match(/[^(\]]+(?=\))/g)[0].split(',').map(
          (key_value: string) => {
            const kv = key_value.trim().split('=');
            return {
              key: kv[0],
              value: kv[1]
            };
          }
        );
        return raw_code;
      }
    }
    return '';
  }

  onLinkTypeChange(event) {
    this.link.resetParameters();
  }

  private linkTypes(link: Link): string[] {
    return link
      .getEndBoard()
      .getBoardConfig()
      .getAcceptedLinks()
      .map((l: LinkOption) => l.getName());
  }

}
