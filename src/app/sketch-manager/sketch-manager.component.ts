import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener, OnDestroy } from '@angular/core';
import { SketchService } from '../sketch/sketch.service';

import { Sketch } from '../sketch/sketch';
import { BoardService } from '../board/board.service';
import { BoardConfig } from '../board-config';
import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-sketch-manager',
  templateUrl: './sketch-manager.component.html',
  styleUrls: ['./sketch-manager.component.sass']
})

export class SketchManagerComponent implements OnInit, AfterViewInit {

  public sketchTypes: string[];
  public boards: BoardConfig[];

  private sketches :Sketch[];
  private selectedSketch: Sketch;
  private editorOn: boolean;
  private timerSubscription: AnonymousSubscription;

  constructor(private ngZone: NgZone, private sketchService: SketchService, private boardService: BoardService) {}

  ngOnInit() {
    this.sketchService.all().then( (sketches: Sketch[] ) => {
      this.sketches = sketches;
    });
    this.refreshBoardData();
    this.sketchTypes = ["pending", "active", "closed"]
  }

  ngAfterViewInit() {

  }

  public ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private refreshBoardData(): void {
    this.boardService.all().then( (boards: BoardConfig[]) => {
      this.boards = boards;
      this.subscribeToData();
    })
  }

  private subscribeToData(): void {
    // this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.refreshBoardData());
  }

  logSketch(){
    console.log(this.selectedSketch);
  }

  activateSketch(id){
    this.sketches[id].changeStatus("active")
    this.sketchService.updateStatus(this.sketches[id]).then((sketch: Sketch)=>{
      this.sketches[id] = sketch;
    });
  }

  stopSketch(id){
    this.sketches[id].changeStatus("closed")
    this.sketchService.updateStatus(this.sketches[id]);
  }

  revertToActive(id: number): void {
    console.log("before", this.sketches[id])
    this.sketchService.get(this.sketches[id].getId()).then( (activeSketch) => {
      this.sketches[id] = activeSketch;
      if(this.selectedSketch.getId() === this.sketches[id].getId())
        this.selectedSketch = this.sketches[id];
      console.log("after", this.sketches[id])
    })
  }

  onSketchEdit(id){
    this.selectedSketch = this.sketches[id];
    console.log(this.selectedSketch)
  }

  newSketch(){
    // send empty array for boards and links
    this.sketchService.create([], []).then( (sketch) => {
      this.selectedSketch = sketch;
      this.sketches.push(sketch);
    })
  }

}
