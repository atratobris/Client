import { Component, OnInit } from '@angular/core';
import { Ng2Cable, Broadcaster } from 'ng2-cable/js/index';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.sass']
})
export class LaptopComponent implements OnInit {
  private url: string = "ws://localhost:3000/cable";

  constructor(private ng2cable: Ng2Cable,
              private broadcaster: Broadcaster) {

    this.ng2cable.subscribe(this.url, 'SketchChannel');
    //By default event name is 'channel name'. But you can pass from backend field { action: 'MyEventName'}

    this.broadcaster.on<string>('SketchChannel').subscribe(
      message => {
        console.log(message);
      }
    );
  }

  ngOnInit() {
  }

}
