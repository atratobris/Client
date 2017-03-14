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
      .then( (response) => Array.from(response.json(), (code: CodeInterface) => new Code(code) ))
      .catch( this.handleError );
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
