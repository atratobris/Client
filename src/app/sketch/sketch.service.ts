import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sketch } from './sketch';

@Injectable()
export class SketchService {
  private apiUrl = 'http://localhost:3000/api/sketch';

  constructor(private http: Http) { }

  getSketch(id: number): Promise<Sketch> {
    return this.http.get(`${this.apiUrl}/${id}`)
      .toPromise()
      .then( response => new Sketch(response.json().data))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
