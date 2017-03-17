import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { SketchService } from '../sketch/sketch.service';
import { Sketch } from '../sketch/sketch';


@Component({
  selector: 'app-sketch-manager',
  templateUrl: './sketch-manager.component.html',
  styleUrls: ['./sketch-manager.component.sass']
})

export class SketchManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  public sketches: Sketch[];
  selectedSketch: Sketch;
  private editorOn: boolean;

  constructor(private ngZone: NgZone, private sketchService: SketchService,
    private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.sketchService.all().then( ( sketches: Sketch[] ) => {
      this.sketches = sketches;
      this.setDefaultSelectedSketch();
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
    if (this.selectedSketch && !this.selectedSketch.isSaved()) {
      alert('Save changes to sketch');
      return;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { sketch_id: this.sketches[id].getId() },
    };
    this.router.navigate(['/dashboard'], navigationExtras);
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
      const id = parseInt(params['id'], 10);
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
    for (const sketch of this.sketches) {
      if (sketch.getStatus() === 'active') {
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
