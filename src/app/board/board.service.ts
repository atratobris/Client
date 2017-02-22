import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { BoardConfig, IBoardConfig } from '../board-config';
import { Board } from './board';

@Injectable()
export class BoardService {
  // private apiUrl = 'http://localhost:3000/api/board';
  private apiUrl = 'http://caplatform.herokuapp.com/api/board';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  get(mac: string): Promise<BoardConfig> {
    return this.http
      .get(`${this.apiUrl}/${mac}.json`)
      .toPromise()
      .then( response => new BoardConfig( response.json()) )
      .catch(this.handleError);
  }

  all(): Promise<BoardConfig[]> {
    return this.http
      .get(`${this.apiUrl}.json`)
      .toPromise()
      .then( response => {
        return Array.from(response.json(), ( board: IBoardConfig, idx: number ) => {
          return new BoardConfig(board);
        });
      })
  }

  update(board: BoardConfig): Promise<BoardConfig> {
    const url = `${this.apiUrl}/${board.getMac()}`;
    return this.http
      .put(url, JSON.stringify(board), {headers: this.headers})
      .toPromise()
      .then(() => board)
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
