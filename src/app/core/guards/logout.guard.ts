import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard {
    constructor(private tokenService: TokenService, private router: Router) {}

    canActivate(){
        this.tokenService.clearToken();
        this.router.navigate(['/home']);
    }
}