import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { SketchService } from '../sketch/sketch.service';

import { Sketch } from '../sketch/sketch';
@Component({
  selector: 'app-sketch-manager',
  templateUrl: './sketch-manager.component.html',
  styleUrls: []
})

export class SketchManagerComponent implements OnInit, AfterViewInit {

  sketchTypes: string[];
  private sketches :Sketch[];
  private selectedSketch: Sketch;
  private editorOn: boolean;

  constructor(private ngZone: NgZone, private sketchService: SketchService) {}

  ngOnInit() {
    this.sketchService.all().then( (sketches: Sketch[] ) => {
      this.sketches = sketches;
    });
    this.sketchTypes = ["pending", "active", "closed"]

  }

  ngAfterViewInit() {

  }

  onStatusChange(event, id){
    this.sketches[id].changeStatus(event);
    this.sketchService.update(this.sketches[id]);
  }

  onSketchEdit(id){
    this.selectedSketch = this.sketches[id];
  }

  newSketch(){
    // send empty array for boards and links
    this.sketchService.create([], []).then( (sketch) => {
      this.selectedSketch = sketch;
      this.sketches.push(sketch);
    })
  }

}
