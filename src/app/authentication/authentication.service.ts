import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router, CanActivate } from '@angular/router';
import { User } from './user';
import 'rxjs/add/operator/toPromise';

import { ENV } from '../../environments/environment';

@Injectable()
export class AuthenticationService implements CanActivate {
  private apiUrl = `${ENV.apiUrl}/sessions`;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private router: Router) { }

  canActivate() {
    if (this.loggedIn()) {
      return true;
    }
    this.router.navigate(['/authentication']);
    return false;
  }

  logIn(user: User): Promise<void> {
    console.log(user);
    return this.http
      .post(`${this.apiUrl}.json`, JSON.stringify(user),  {headers: this.headers})
      .toPromise()
      .then( response => {
        localStorage.setItem('atrato-user-id', response.json().id);
        this.router.navigate(['/dashboard']);
      }).catch( this.handleError);
  }


  loggedIn() {
    return !!localStorage.getItem('atrato-user-id');
  }

  handleLoggedIn() {
    if (this.loggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
