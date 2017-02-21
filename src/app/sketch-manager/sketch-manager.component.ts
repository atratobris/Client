import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener, OnDestroy } from '@angular/core';
import { SketchService } from '../sketch/sketch.service';

import { Sketch, SketchStatus } from '../sketch/sketch';
import { BoardService } from '../board/board.service';
import { BoardConfig } from '../board-config';
import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
import { BrowserDetails } from '../lib/browser-details';

@Component({
  selector: 'app-sketch-manager',
  templateUrl: './sketch-manager.component.html',
  styleUrls: []
})

export class SketchManagerComponent implements OnInit, AfterViewInit {

  public sketchTypes: string[];
  public boards: BoardConfig[];
  public browserDetails = BrowserDetails.getDetails();

  private sketches :Sketch[];
  private selectedSketch: Sketch;
  private editorOn: boolean;
  private timerSubscription: AnonymousSubscription;

  constructor(private ngZone: NgZone, private sketchService: SketchService, private boardService: BoardService) {}

  ngOnInit() {
    this.sketchService.all().then( (sketches: Sketch[] ) => {
      this.sketches = sketches;
    });
    const types = Object.keys(SketchStatus)
    this.sketchTypes = types.slice(types.length/2)
    this.refreshBoardData();
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
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.refreshBoardData());
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
