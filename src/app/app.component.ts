import { Component } from '@angular/core';

import { AuthenticationService } from './authentication/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  constructor(private authenticationService: AuthenticationService) {}

  logout(): void {
    this.authenticationService.logout();
  }

  loggedIn(): boolean {
    return this.authenticationService.loggedIn();
  }

  userName(): string {
    return this.authenticationService.getUserName();
  }
}
