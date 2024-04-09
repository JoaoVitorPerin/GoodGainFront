import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard {
    constructor(private tokenService: TokenService, private router: Router) {}

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        
    return new Observable(observer => {
        const token = this.tokenService.getToken();
            if (token) {
                this.router.navigate(['/404']);
                observer.next(false);
            }else {
                this.router.navigate(['/home']);
                observer.next(false);
            }
                observer.complete();
        });
    }
}