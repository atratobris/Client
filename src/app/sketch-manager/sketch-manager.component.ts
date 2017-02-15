import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { SketchService } from '../sketch/sketch.service';

import { Sketch, SketchStatus } from '../sketch/sketch';
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
    var types = Object.keys(SketchStatus)
    this.sketchTypes = types.slice(types.length/2)
  }

  ngAfterViewInit() {

  }

  onStatusChange(event, id){
    console.log(this.sketches[id]);
    this.sketches[id].changeStatus(event);
    this.sketchService.update(this.sketches[id]);
  }

  onSketchEdit(id){
    this.selectedSketch = this.sketches[id];
  }

  newSketch(){
    this.sketchService.create([], []).then( (sketch) => {
      this.selectedSketch = sketch;
      this.sketches.push(sketch);
    })
  }

}
