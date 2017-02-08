import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sketch } from './sketch';

@Injectable()
export class SketchService {
  private apiUrl = 'http://localhost:3000/api/sketch';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  get(id: number): Promise<Sketch> {
    return this.http
      .get(`${this.apiUrl}/${id}`)
      .toPromise()
      .then( response => new Sketch(response.json().data) )
      .catch( this.handleError );
  }

  update(sketch: Sketch): Promise<Sketch> {
    const url = `${this.apiUrl}/${sketch.getId()}`;
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
