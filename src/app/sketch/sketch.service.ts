import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Board } from '../board/board';
import { Link } from '../link';

import 'rxjs/add/operator/toPromise';

import { Sketch, SketchInterface } from './sketch';

@Injectable()
export class SketchService {
  private apiUrl = 'http://localhost:3000/api/sketch';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  get(id: number): Promise<Sketch> {
    return this.http
      .get(`${this.apiUrl}/${id}`)
      .toPromise()
      .then( response => new Sketch(response.json()) )
      .catch( this.handleError );
  }

  all(): Promise<Sketch[]> {
    return this.http
      .get(`${this.apiUrl}`)
      .toPromise()
      .then( response => {
        return Array.from(response.json(), ( x: SketchInterface )=> {
          return new Sketch(x);
        });
      }).catch( this.handleError);
  }

  create(newBoards: Board[], newLinks: Link[]): Promise<Sketch> {
    return this.http
      .post(`${this.apiUrl}`, JSON.stringify({boards: newBoards, links: newLinks}), {headers: this.headers})
      .toPromise()
      .then( response => {
        return new Sketch(response.json())
      })
      .catch(this.handleError);
  }

  update(sketch: Sketch): Promise<Sketch> {
    const url = `${this.apiUrl}/${sketch.getId()}.json`;
    return this.http
      .put(url, JSON.stringify(sketch), {headers: this.headers})
      .toPromise()
      .then(() => sketch)
      .catch(this.handleError);

  }


  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
