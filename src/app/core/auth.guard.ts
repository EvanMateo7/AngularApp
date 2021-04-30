import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router){}

  canActivate( 
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.auth.user.pipe(
      take(1),
      map(user => {
        if(user.roles != null)
          return !!user && user.roles.includes(next.data.role);
        return false;
        }),
      tap(loggedIn => {
        if(!loggedIn) {
          console.error('Access Denied');
        }
      })
    );
  }
}
