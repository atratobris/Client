import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.sass']
})
export class LaptopComponent implements OnInit, OnDestroy {
  private input: boolean;
  private output: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  activateOutput(): void {
    this.router.navigate(['/laptop-output']);
  }

  activateInput(): void {
    this.router.navigate(['/laptop-input']);
  }

}
