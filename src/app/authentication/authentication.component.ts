import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.sass']
})
export class AuthenticationComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // if the session is authenticated, send to dashboard
    if (this.authenticationService.loggedIn()) {
      this.authenticationService.handleLoggedIn();
    }
  }

}
