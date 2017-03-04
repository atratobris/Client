import { Component, OnInit } from '@angular/core';

import { Sketch } from '../sketch/sketch';
import { SketchService } from '../sketch/sketch.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.sass']
})
export class MarketplaceComponent implements OnInit {
  public sketches: Sketch[];

  constructor(private sketchService: SketchService) {}

  ngOnInit() {
    this.sketchService.marketplace().then( ( sketches: Sketch[] ) => {
      this.sketches = sketches;
      console.log(this.sketches[0].getBoardConfigs())
    });
  }

}
