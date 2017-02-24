import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Link } from './link';

@Injectable()
export class LinkService {
  private apiUrl = 'http://localhost:3000/api/board';
  // private apiUrl = 'http://caplatform.herokuapp.com/api/board';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  update(link: Link): Promise<link> {
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
