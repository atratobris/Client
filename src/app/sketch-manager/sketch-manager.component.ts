import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SketchService } from '../sketch/sketch.service';

import { Sketch } from '../sketch/sketch';
import { LinkOption } from '../link/link';
import { BoardService } from '../board/board.service';
import { LinkService } from '../link/link.service';
import { BoardConfig } from '../board-config';

@Component({
  selector: 'app-sketch-manager',
  templateUrl: './sketch-manager.component.html',
  styleUrls: ['./sketch-manager.component.sass']
})

export class SketchManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  public sketches: Sketch[];
  public links: LinkOption[];
  selectedSketch: Sketch;
  private editorOn: boolean;

  constructor(private ngZone: NgZone, private sketchService: SketchService,
    private boardService: BoardService, private linkService: LinkService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.sketchService.all().then( ( sketches: Sketch[] ) => {
      this.sketches = sketches;
      this.setDefaultSelectedSketch();
    });
    this.linkService.all().then( ( links: LinkOption[] ) => {
      this.links = links;
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
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
    if (!this.selectedSketch.isSaved()) {
      alert('Save or Revert changes to sketch');
      return;
    }
    this.selectedSketch = this.sketches[id];
  }

  onNameUpdated(newName): void {
    this.selectedSketch.setName(newName);
    this.sketchService.update(this.selectedSketch).then( (sketch: Sketch) => {
      this.selectedSketch = sketch;
    });
  }

  newSketch(): void {
    // send empty array for boards and links
    this.sketchService.create([], []).then( (sketch) => {
      this.selectedSketch = sketch;
      this.sketches.push(sketch);
    });
  }

  private setDefaultSelectedSketch(): void {
    this.activatedRoute.queryParams.subscribe( (params) => {
      const id = parseInt(params["id"], 10);
      for (const sketch of this.sketches) {
        if (sketch.getId() === id) {
          this.selectedSketch = sketch;
          this.selectedSketch.newPurchase = true;
          break;
        }
      }
      if (!this.selectedSketch) {
        this.selectedSketch = this.defaultSketch();
      }
    });
  }

  private defaultSketch(): Sketch {
    for (let sketch of this.sketches) {
      if (sketch.getStatus() == "active") {
        return sketch;
      }
    }
    return this.sketches[0];
  }

  publishToMarket(id: number): void {
    this.sketches[id].listed = true;
    this.sketchService.update(this.sketches[id]).then( (sketch) => this.sketches[id] = sketch );
  }

  removeFromMarket(id: number): void {
    this.sketches[id].listed = false;
    this.sketchService.update(this.sketches[id]).then( (sketch) => this.sketches[id] = sketch );
  }

}
