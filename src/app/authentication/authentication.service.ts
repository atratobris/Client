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
  private idKey = 'atrato-user-id';
  private nameKey = 'atrato-user-name';

  constructor(private http: Http, private router: Router) { }

  canActivate() {
    if (this.loggedIn()) {
      return true;
    }
    this.router.navigate(['/authentication']);
    return false;
  }

  logIn(user: User): Promise<void> {
    return this.http
      .post(`${this.apiUrl}.json`, JSON.stringify(user),  {headers: this.headers})
      .toPromise()
      .then( response => {
        const jsonResponse = response.json();
        this.setCurrentUserId(jsonResponse.id);
        this.setUserName(jsonResponse.name);
        this.handleLoggedIn();
      }).catch( this.handleError);
  }

  loggedIn() {
    return !!this.getCurrentUserId();
  }

  handleLoggedIn() {
    if (this.loggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  getCurrentUserId(): number {
    return parseInt(localStorage.getItem(this.idKey), 10);
  }

  setCurrentUserId(value: string): void {
    localStorage.setItem(this.idKey, value);
  }

  getUserName(): string {
    return localStorage.getItem(this.nameKey);
  }

  setUserName(value: string): void {
    localStorage.setItem(this.nameKey, value);
  }

  logout(): void {
    localStorage.removeItem(this.idKey);
    this.router.navigate(['/authentication']);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
