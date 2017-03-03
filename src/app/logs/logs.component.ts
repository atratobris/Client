import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng2Cable } from 'ng2-cable/js/index';
import { Log } from './log';
import { ENV } from '../../environments/environment';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.sass']
})
export class LogsComponent implements OnInit, OnDestroy {
  private url: string = ENV.apiWs;
  public logs: Log[];

  constructor(private ng2cable: Ng2Cable) {
    this.ng2cable.setCable(this.url);
  }

  ngOnInit() {
    this.ng2cable.subscription = this.ng2cable.cable.subscriptions.create({ channel: 'LogChannel' }, {
      received: (data) => {
        this.logs = data.message.map((log: any) => new Log(log) );
      }
    });
  }

  ngOnDestroy() {
    this.ng2cable.unsubscribe();
  }

}
