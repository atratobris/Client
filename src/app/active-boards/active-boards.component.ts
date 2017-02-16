import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardService } from '../board/board.service';
import { BoardConfig } from '../board-config';
import { Observable } from 'rxjs/Rx';
import {AnonymousSubscription} from "rxjs/Subscription";

@Component({
  selector: 'app-active-boards',
  templateUrl: './active-boards.component.html',
  styleUrls: ['./active-boards.component.sass']
})
export class ActiveBoardsComponent implements OnInit, OnDestroy {
  boards: BoardConfig[];
  private timerSubscription: AnonymousSubscription;

  constructor(private boardService: BoardService) { }

  public ngOnInit() {
    this.refreshData();
  }

  public ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private refreshData(): void {
    this.boardService.all().then( (boards: BoardConfig[]) => {
      this.boards = boards;
      this.subscribeToData();
    })
  }

  private subscribeToData(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.refreshData());
  }

}
