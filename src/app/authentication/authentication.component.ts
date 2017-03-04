import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User } from './user';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.sass']
})
export class AuthenticationComponent implements OnInit {
  public login = true;
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
    console.log(this.user);
  }

}
