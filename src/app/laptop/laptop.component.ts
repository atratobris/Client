import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.sass']
})
export class LaptopComponent implements OnInit, OnDestroy {
  private input: boolean;
  private output: boolean;

  constructor() {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  activateOutput(): void {
    this.input = false;
    this.output = true;

  }

  activateInput(): void {
    this.output = false;
    this.input = true;
  }

}
