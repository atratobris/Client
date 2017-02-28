import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ENV } from '../../environments/environment';

import { LinkOption, LinkOptionInterface } from '../link/link';

@Injectable()
export class LinkService {
  private apiUrl = `${ENV.apiUrl}/links`;

  constructor(private http: Http) { }

  all(): Promise<LinkOption[]> {
    return this.http
      .get(`${this.apiUrl}.json`)
      .toPromise()
      .then( response => {
        return Array.from(response.json(), ( x: LinkOptionInterface ) => new LinkOption(x) );
      }).catch( this.handleError );
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
