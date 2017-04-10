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
    const search: URLSearchParams = new URLSearchParams();
    search.set('user_id', localStorage.getItem('atrato-user-id'));
    return this.http
      .get(`${this.apiUrl}/${mac}.json`, {search})
      .toPromise()
      .then( response => new BoardConfig( response.json()) )
      .catch(this.handleError);
  }

  all(): Promise<BoardConfig[]> {
    const search: URLSearchParams = new URLSearchParams();
    search.set('user_id', localStorage.getItem('atrato-user-id'));
    return this.http
      .get(`${this.apiUrl}.json`, {search})
      .toPromise()
      .then( response => response.json().map((board: IBoardConfig) => new BoardConfig(board)) )
      .catch(this.handleError);
  }

  update(board: BoardConfig): Promise<BoardConfig> {
    const url = `${this.apiUrl}/${board.getMac()}`;
    return this.http
      .put(url, this.board_params(board), {headers: this.headers})
      .toPromise()
      .then(() => board)
      .catch(this.handleError);
  }

  request_register(code: string): Promise<void> {
    return this.http
      .post(`${this.apiUrl}/register.json`, {partial_mac: code, user_id: localStorage.getItem('atrato-user-id')}, {headers: this.headers})
      .toPromise()
      .then((response) => {
        console.log( Array.from(response.json(), (board) => board));
      })
      .catch(this.handleError);
  }

  deregister(board: BoardConfig): Promise<void> {
    return this.http
      .post(`${this.apiUrl}/deregister.json`, this.board_params(board), {headers: this.headers})
      .toPromise()
      .then((response) => {
        console.log('Success');
      })
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  private board_params(board): {[key: string]: any} {
    const params = {};
    Object.assign(params, board);
    console.log(params);
    const user_id = {user_id: localStorage.getItem('atrato-user-id')};
    Object.assign(params, user_id);
    return params;
  }
}
