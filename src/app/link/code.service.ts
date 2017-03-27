import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ENV } from '../../environments/environment';

import { CodeInterface, Code } from './code';

@Injectable()
export class CodeService {
  private apiUrl = `${ENV.apiUrl}/code_snippet`;

  constructor(private http: Http) { }

  all(boardType: string, linkTypes: string[]): Promise<Code[]> {
    const search: URLSearchParams = new URLSearchParams();
    search.set('board_type', boardType);
    for (const type of linkTypes) {
      search.append('link_types[]', type);
    }
    return this.http
      .get(`${this.apiUrl}.json`, {search})
      .toPromise()
      .then( (response) => response.json().map((code: CodeInterface) => new Code(code) ) )
      .catch( this.handleError );
  }

  sketchCode(sketchId: number): Promise<Code> {
    const search: URLSearchParams = new URLSearchParams();
    search.set('sketch_id', sketchId.toString());
    return this.http
      .get(`${this.apiUrl}/sketch.json`, {search})
      .toPromise()
      .then( (response) => new Code(response.json()) )
      .catch( this.handleError );
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
