import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng2Cable } from 'ng2-cable/js/index';
import { BrowserDetails } from '../lib/browser-details';

import { ENV } from '../../environments/environment';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.sass']
})
export class LaptopComponent implements OnInit, OnDestroy {
  public events: string[] = [];
  private url: string = ENV.apiWs;
  // private url: string = 'ws://caplatform.herokuapp.com/cable';
  private mac: string = BrowserDetails.getDetails();

  constructor(private ng2cable: Ng2Cable) {
    this.events.push(`Registering laptop with mac: ${this.mac}`);
    this.ng2cable.setCable(this.url);
  }

  ngOnInit() {
    this.ng2cable.subscription = this.ng2cable.cable.subscriptions.create({ channel: 'SketchChannel', mac: this.mac }, {
      received: (data) => {
        const message = data.message;
        this.events.push(`Received channel message with type: ${message.type}`);
        if (message.type === 'link_opener') {
          this.events.push(`Going to open ${message.url}`);
          window.open(message.url);
        }
      }
    });

    this.events.push(`Started connection with ${this.ng2cable.subscription.consumer.url}`);
  }

  ngOnDestroy() {
    this.ng2cable.unsubscribe();
  }

}
