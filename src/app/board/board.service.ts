import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { BoardConfig, IBoardConfig } from '../board-config';
import { Board } from './board';

import { ENV } from '../../environments/environment';

@Injectable()
export class BoardService {
  private apiUrl = `${ENV.apiUrl}/board`;
  // private apiUrl = 'http://caplatform.herokuapp.com/api/board';
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
      });
  }

  update(board: BoardConfig): Promise<BoardConfig> {
    const url = `${this.apiUrl}/${board.getMac()}`;
    return this.http
      .put(url, JSON.stringify(board), {headers: this.headers})
      .toPromise()
      .then(() => board)
      .catch(this.handleError);
  }

  request_register(code: string): Promise<void> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('code', code);
    return this.http
      .post(`${this.apiUrl}/register.json`, JSON.stringify({partial_mac: code}), {headers: this.headers})
      .toPromise()
      .then((response) => {
        console.log( Array.from(response.json(), (board) => board));
      })
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
