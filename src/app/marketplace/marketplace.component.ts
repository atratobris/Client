import { Component, OnInit } from '@angular/core';

import { Sketch } from '../sketch/sketch';
import { BoardConfig } from '../board-config';
import { SketchService } from '../sketch/sketch.service';
import { BoardService } from '../board/board.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.sass']
})
export class MarketplaceComponent implements OnInit {
  public sketches: Sketch[];
  public boards: BoardConfig[];
  public boardMacs: string[];

  constructor(private sketchService: SketchService, private boardService: BoardService,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.sketchService.marketplace().then( ( sketches: Sketch[] ) => this.sketches = sketches );
    this.boardService.all().then( ( boards: BoardConfig[] ) => {
      this.boards = boards;
      this.boardMacs = this.boards.map((board) => board.getMac());
    });
  }

  hardwareClass(mac: string): string {
    if (this.boardMacs.includes(mac)) {
      return "owned";
    }
    return "not-owned";
  }

  canBuySketch(sketch: Sketch): boolean {
    if (!this.mySketch(sketch) && this.ownAllBoards(sketch)) {
      return true;
    }
    return false;
  }

  ownAllBoards(sketch: Sketch): boolean {
    const sketchMacs = sketch.getBoardConfigs().map( (config) => config.mac );
    for (const mac of sketchMacs) {
      if (!this.boardMacs.includes(mac)) {
        return false;
      }
    }
    return true;
  }

  missingBoards(sketch: Sketch): string {
    let missing: string[] = [];
    const sketchMacs = sketch.getBoardConfigs().map( (config) => config.mac );
    for (const mac of sketchMacs) {
      if (!this.boardMacs.includes(mac)) {
        missing.push(mac);
      }
    }
    return missing.join(", ");
  }

  mySketch(sketch: Sketch): boolean {
    if (sketch.getUserId() === this.authenticationService.getCurrentUserId()) {
      return true;
    }
    return false
  }

  buySketch(sketch: Sketch): void {
    this.sketchService
      .purchase(sketch, this.authenticationService.getCurrentUserId())
      .then( (sketch) => this.authenticationService.redirectToRoot({id: sketch.getId()}) );
  }

}
