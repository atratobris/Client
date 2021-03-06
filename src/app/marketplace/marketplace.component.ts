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
  public boardTypes: string[];

  constructor(private sketchService: SketchService, private boardService: BoardService,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.sketchService.marketplace().then( ( sketches: Sketch[] ) => this.sketches = sketches );
    this.boardService.all('RealBoard').then( ( boards: BoardConfig[] ) => {
      this.boards = boards;
      this.boardTypes = this.boards.map((board) => board.getType());
    });
    (<any>window).$.getScript( "https://checkout.stripe.com/checkout.js", ( data, textStatus, jqxhr ) => {});
  }

  hardwareClass(type: string): string {
    if (this.boardTypes.includes(type)) {
      return 'owned';
    }
    return 'not-owned';
  }

  canBuySketch(sketch: Sketch): boolean {
    if (!this.mySketch(sketch) && this.ownAllBoards(sketch)) {
      return true;
    }
    return false;
  }

  ownAllBoards(sketch: Sketch): boolean {
    const sketchTypes = sketch.getBoardConfigs()
      .filter( (config) => config.isReal() )
      .map( (config) => config.type );
    for (const type of sketchTypes) {
      if (!this.boardTypes.includes(type)) {
        return false;
      }
    }
    return true;
  }

  missingBoards(sketch: Sketch): string {
    const missing: string[] = [];
    const sketchTypes = sketch.getBoardConfigs()
      .filter( (config) => config.isReal() )
      .map( (config) => config.type );

    for (const type of sketchTypes) {
      if (!this.boardTypes.includes(type)) {
        missing.push(type);
      }
    }
    return missing.join(', ');
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

  openCheckout(sketch: Sketch) {
    const handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_8lOLmwnqNxolTOAC5sGEOwng',
      locale: 'auto',
      currency: 'gbp',
      token: (token: any) => {
        this.buySketch(sketch);
      }
    });

    handler.open({
      name: sketch.getName(),
      description: sketch.getDescription(),
      amount: 500
    });
  }
}
