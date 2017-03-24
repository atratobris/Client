import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng2Cable, Broadcaster } from 'ng2-cable/js/index';
import { BrowserDetails } from '../../lib/browser-details';

import { ENV } from '../../../environments/environment';

@Component({
  selector: 'app-laptop-input',
  templateUrl: './laptop-input.component.html',
  styleUrls: ['./laptop-input.component.sass']
})
export class LaptopInputComponent implements OnInit, OnDestroy {
  public events: string[] = [];
  private url: string = ENV.apiWs;
  private deviceType: string = 'Input';
  private mac: string = `${localStorage.getItem('atrato-user-id')}|${BrowserDetails.getDetails()}|${this.deviceType}`;

  constructor(private ng2cable: Ng2Cable, private broadcaster: Broadcaster) {
    this.events.push(`Registering laptop with mac: ${this.mac}`);
    this.ng2cable.setCable(this.url);
  }

  ngOnInit() {
    this.registerToChannel();
  }

  registerToChannel(): void {
    this.ng2cable.subscription = this.ng2cable.cable.subscriptions.create({ channel: 'SketchChannel',
                                      mac: this.mac, type: this.deviceType });

    this.events.push(`Started connection with ${this.ng2cable.subscription.consumer.url}`);
  }

  triggerInput(): void {
    this.ng2cable.subscription.perform("blink", { "mac": this.mac })
  }

  ngOnDestroy() {
    this.ng2cable.unsubscribe();
  }
}
