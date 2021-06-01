import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthenticationService, JWT_NAME } from '../../services/authentication-service/authentication.service';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem(JWT_NAME);
    
    const tokenPayload: any = decode(token);
    if (
      !this.auth.isAuthenticated() || 
      tokenPayload.user.role !== expectedRole
    ) {
      return false;
    }
    return true;
  }
}