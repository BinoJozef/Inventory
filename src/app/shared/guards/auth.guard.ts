import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services/authentication.service';



@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private authenticationService: AuthenticationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
 
   return this.authenticationService.isAuthenticated().map(u=>{
     if(u===false){
      this.router.navigate(['/login'],{ queryParams: { returnUrl: state.url } });
      return false;
     }
     else
     return true;
   });
  
  }
}
