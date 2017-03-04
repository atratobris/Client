import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router, CanActivate } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { ENV } from '../../environments/environment';

@Injectable()
export class AuthenticationService implements CanActivate {
  private apiUrl = `${ENV.apiUrl}/authentication`;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private router: Router) { }

  canActivate() {
    if (this.loggedIn()) {
      return true;
    }
    this.router.navigate(['/authentication']);
    return false;
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
