import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams} from '@angular/http';

import { Board } from '../board/board';
import { Link, LinkInterface } from '../link/link';

import 'rxjs/add/operator/toPromise';

import { Sketch, SketchInterface } from './sketch';

import { ENV } from '../../environments/environment';

@Injectable()
export class SketchService {
  // private apiUrl = 'http://caplatform.herokuapp.com/api/sketch';
  private apiUrl = `${ENV.apiUrl}/sketch`;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  get(id: number): Promise<Sketch> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('user_id', localStorage.getItem('atrato-user-id'));
    return this.http
      .get(`${this.apiUrl}/${id}.json`, {search: params})
      .toPromise()
      .then( response => new Sketch(response.json()) )
      .catch( this.handleError );
  }

  all(): Promise<Sketch[]> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('user_id', localStorage.getItem('atrato-user-id'));
    return this.http
      .get(`${this.apiUrl}.json`, {search: params})
      .toPromise()
      .then( response => {
        return Array.from(response.json(), ( x: SketchInterface ) => {
          return new Sketch(x);
        });
      }).catch( this.handleError );
  }

  marketplace(): Promise<Sketch[]> {
    return this.http
      .get(`${ENV.apiUrl}/marketplace.json`)
      .toPromise()
      .then( response => {
        return Array.from(response.json(), ( x: SketchInterface ) => {
          return new Sketch(x);
        });
      }).catch( this.handleError );
  }

  create(newBoards: Board[], newLinks: Link[]): Promise<Sketch> {
    return this.http
      .post(`${this.apiUrl}.json`,
        JSON.stringify({boards: newBoards, links: newLinks, user_id: localStorage.getItem('atrato-user-id')}), {headers: this.headers})
      .toPromise()
      .then( response => {
        return new Sketch(response.json());
      })
      .catch(this.handleError);
  }

  update(sketch: Sketch): Promise<Sketch> {
    const url = `${this.apiUrl}/${sketch.getId()}.json`;
    let obj = { 'user_id': localStorage.getItem('atrato-user-id') };
    for (let i in sketch) {
      obj[i] = sketch[i]
    }
    return this.http
      .put(url, obj, {headers: this.headers})
      .toPromise()
      .then(() => sketch)
      .catch(this.handleError);
  }

  updateLinks(sketch: Sketch, links: LinkInterface[]): Promise<Sketch> {
    const url = `${this.apiUrl}/${sketch.getId()}.json`;
    return this.http
      .put(url, {'links': links, 'user_id': localStorage.getItem('atrato-user-id') }, {headers: this.headers})
      .toPromise()
      .then(() => sketch)
      .catch(this.handleError);
  }

  updateStatus(sketch: Sketch): Promise<Sketch> {
    const url = `${this.apiUrl}/${sketch.getId()}.json`;
    return this.http
      .put(url, {'status': sketch.getStatus(), 'user_id': localStorage.getItem('atrato-user-id') }, {headers: this.headers})
      .toPromise()
      .then(() => sketch)
      .catch(this.handleError);
  }

  removeSketch(sketch: Sketch): Promise<boolean> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('user_id', localStorage.getItem('atrato-user-id'));
    const url = `${this.apiUrl}/${sketch.getId()}.json`;
    return this.http
      .delete(url, {search: params})
      .toPromise()
      .then( response => response.status === 204 )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
