import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { SketchService } from '../sketch/sketch.service';

import { Sketch } from '../sketch/sketch';
@Component({
  selector: 'app-dashboard',
  templateUrl: './sketch-manager.component.html',
  styleUrls: []
})
export class SketchManagerComponent implements OnInit, AfterViewInit {

  private sketches :Sketch[];
  private selectedSketch: Sketch;

  constructor(private ngZone: NgZone, private sketchService: SketchService) {}

  ngOnInit() {
    this.sketchService.all().then( (sketches: Sketch[] ) => {
      this.sketches = sketches;
    });
  }

  open(sketch: Sketch) {
    this.router.navigate(['/component-one']);
  }

  ngAfterViewInit() {
  }

  clicked(event): void {
  }

  changeMode(operation: string): void {

  }

  onSelected(): void {
    // select the sketch
  }

  onDeselected(): void {
    // delete this.selectedBoard;
  }


}
