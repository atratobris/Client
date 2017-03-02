import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, HostListener, OnDestroy } from '@angular/core';
import { SketchService } from '../sketch/sketch.service';

import { Sketch } from '../sketch/sketch';
import { LinkOption } from '../link/link';
import { BoardService } from '../board/board.service';
import { LinkService } from '../link/link.service';
import { BoardConfig } from '../board-config';
import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sketch-manager',
  templateUrl: './sketch-manager.component.html',
  styleUrls: ['./sketch-manager.component.sass']
})

export class SketchManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  public boards: BoardConfig[];
  public sketches: Sketch[];
  public links: LinkOption[];

  selectedSketch: Sketch;
  private editorOn: boolean;
  private timerSubscription: AnonymousSubscription;

  constructor(private ngZone: NgZone, private sketchService: SketchService,
    private boardService: BoardService, private linkService: LinkService) {}

  ngOnInit() {
    this.sketchService.all().then( (sketches: Sketch[] ) => {
      this.sketches = sketches;
    });
    this.linkService.all().then( (links: LinkOption[]) => {
      this.links = links;
    });
    this.refreshBoardData();
  }

  ngAfterViewInit() {

  }

  public ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private refreshBoardData(): void {
    this.boardService.all().then( (boards: BoardConfig[]) => {
      this.boards = boards;
      this.subscribeToData();
    });
  }

  private subscribeToData(): void {
    // this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.refreshBoardData());
  }

  activateSketch(id: number): void {
    // stop all sketches before activating this one
    for ( let i = 0; i < this.sketches.length; i++ ) {
      if (this.sketches[i].getStatus() === 'active') {
        this.stopSketch(i);
      }
    }
    this.sketches[id].changeStatus('active');
    this.sketchService.updateStatus(this.sketches[id]).then((sketch: Sketch) => {
      this.sketches[id] = sketch;
    });
  }

  removeSketch(id: number): void {
    this.sketchService.removeSketch(this.sketches[id]).then( removed => {
      if (removed) {
        if (this.sketches[id] === this.selectedSketch) {
          delete this.selectedSketch;
        }
        this.sketches.splice(id, 1);
      }
    });
  }

  stopSketch(id: number): void {
    this.sketches[id].changeStatus('closed');
    this.sketchService.updateStatus(this.sketches[id]);
  }

  onSketchEdit(id: number): void {
    this.selectedSketch = this.sketches[id];
  }

  newSketch(): void {
    // send empty array for boards and links
    this.sketchService.create([], []).then( (sketch) => {
      this.selectedSketch = sketch;
      this.sketches.push(sketch);
    });
  }

}
