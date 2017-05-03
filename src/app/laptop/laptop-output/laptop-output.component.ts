import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng2Cable } from 'ng2-cable/js/index';
import { BrowserDetails } from '../../lib/browser-details';

import { ENV } from '../../../environments/environment';

@Component({
  selector: 'app-laptop-output',
  templateUrl: './laptop-output.component.html',
  styleUrls: ['./laptop-output.component.sass']
})
export class LaptopOutputComponent implements OnInit, OnDestroy {
  public events: string[] = [];
  private url: string = ENV.apiWs;
  private deviceType: string = 'Screen';
  // private mac: string = `${localStorage.getItem('atrato-user-id')}|${BrowserDetails.getDetails()}${this.deviceType}`;
  private mac: string = `${localStorage.getItem('atrato-user-id')}|LaptopScreen`;

  constructor(private ng2cable: Ng2Cable) {
    this.events.push(`Registering laptop with mac: ${this.mac}`);
    this.ng2cable.setCable(this.url);
  }

  ngOnInit() {
    this.registerToChannel();
  }

  registerToChannel(): void {
    this.ng2cable.subscription = this.ng2cable.cable.subscriptions.create({ channel: 'SketchChannel',
                                      mac: this.mac, type: this.deviceType, user_id: localStorage.getItem('atrato-user-id') }, {
      received: (data) => {
        const message = data.message;
        this.events.push(`Received channel message with type: ${message.type}`);
        window.open(message.url);
      }
    });
    this.events.push(`Started connection with ${this.ng2cable.subscription.consumer.url}`);
  }

  ngOnDestroy() {
    this.ng2cable.unsubscribe();
  }
}
