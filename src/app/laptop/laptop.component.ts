import { Component, OnInit } from '@angular/core';
import { Ng2Cable, Broadcaster } from 'ng2-cable/js/index';
import { BrowserDetails } from '../lib/browser-details';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.sass']
})
export class LaptopComponent implements OnInit {
  public events: string[] = [];
  private url: string = "ws://localhost:3000/cable";
  // private url: string = 'ws://caplatform.herokuapp.com/cable';
  private mac: string = BrowserDetails.getDetails();

  constructor(private ng2cable: Ng2Cable,
              private broadcaster: Broadcaster) {

    // fix so that the link for details will be the right url whichcan then be parsed by rails
    this.mac = this.mac.replace(/\./g,'')
    this.events.push(`Registering laptop with mac: ${this.mac}`);
    this.ng2cable.subscribe(this.url, "BadChannel");
    this.ng2cable.cable.subscriptions.create({ channel: 'SketchChannel', mac: this.mac }, {
      received: (data) => {
        const message = data.message
        console.log(message);
        this.events.push(`Received channel message with type: ${message.type}`);
        if (message.type === "link_opener") {
          this.events.push(`Going to open ${message.url}`);
          window.open(message.url);
        }
      }
    })
    this.events.push(`Started connection with ${this.ng2cable.subscription.consumer.url}`);
  }

  ngOnInit() {
  }

}
