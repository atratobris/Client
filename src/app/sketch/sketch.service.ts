import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams} from '@angular/http';

import { Board } from '../board/board';
import { Link, LinkInterface } from '../link/link';

import 'rxjs/add/operator/toPromise';

import { Sketch, SketchInterface } from './sketch';
import { BoardInterface } from '../board/board';

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
        return Array.from(response.json(), ( sketch: SketchInterface ) => {
          return new Sketch(sketch);
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

  purchase(sketch: Sketch, user_id: number): Promise<Sketch> {
    const object = {user_id: user_id, sketch_id: sketch.getId()};
    return this.http
      .post(`${ENV.apiUrl}/marketplace/purchase.json`, object, { headers: this.headers })
      .toPromise()
      .then( (response) => new Sketch(response.json()))
      .catch( this.handleError );
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
    const obj = sketch.prepare();
    const user_id = {user_id: localStorage.getItem('atrato-user-id')};
    Object.assign(obj, user_id);
    return this.http
      .put(url, obj, {headers: this.headers})
      .toPromise()
      .then(() => sketch)
      .catch(this.handleError);
  }

  updateLinks(sketch: Sketch, links: Link[]): Promise<Sketch> {
    const url = `${this.apiUrl}/${sketch.getId()}.json`;
    const linksInterface = Array.from( links, (l: Link) => l.prepare() );
    return this.http
      .put(url, {'links': linksInterface, 'user_id': localStorage.getItem('atrato-user-id') }, {headers: this.headers})
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
