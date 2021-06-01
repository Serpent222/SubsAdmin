import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import decode from 'jwt-decode';
import { AuthenticationService, JWT_NAME } from './services/authentication-service/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthenticationService) {}

  navigateTo(value) {
    this.router.navigate(['../', value]);
  }

  logout() {
    this.router.navigate(['login']);
    this.authService.logout();
  }

  getId(): number {
    if(this.authService.isAuthenticated()){
      const token = localStorage.getItem(JWT_NAME);
      const tokenPayload: any = decode(token);
      return tokenPayload.user.id;
    }
    else{
      return;
    }
  }

  getRole(): string {
    if(this.authService.isAuthenticated()){
      const token = localStorage.getItem(JWT_NAME);
      const tokenPayload: any = decode(token);
      return tokenPayload.user.role;
    }
    else{
      return;
    }
  }

  getUsername(): string {
    if(this.authService.isAuthenticated()){
      const token = localStorage.getItem(JWT_NAME);
      const tokenPayload: any = decode(token);
      return tokenPayload.user.username;
    }
    else{
      return "";
    }
  }
}
