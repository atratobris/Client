import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User } from './user';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.sass']
})
export class AuthenticationComponent implements OnInit {
  public submitted = false;
  public user: User;

  constructor(private authenticationService: AuthenticationService) {
    this.user = new User();
  }

  ngOnInit() {
    // if the session is authenticated, send to dashboard
    if (this.authenticationService.loggedIn()) {
      this.authenticationService.handleLoggedIn();
    }
  }

  submit(): void {
    this.authenticationService.logIn(this.user);
    this.submitted = true;
  }

}
