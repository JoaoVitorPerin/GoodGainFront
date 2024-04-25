import { environment } from 'src/environments/environment';
import { TokenService } from './../services/token.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard  {

  readonly API_BACK: string = environment.API_BACK

  constructor(private tokenService: TokenService, private router: Router) { }

  private verificacaoLogin(): boolean {

    const token = this.tokenService.getJwtDecoded();

    if (token) {
      const date = new Date();
      const datetoken = new Date(token.exp);
      if (datetoken < date) {
        return true;
      }
    }

    this.tokenService.clearToken();
    this.router.navigate(['/home'])
    return false;
  }

  canActivate(): boolean {
    return this.verificacaoLogin()
  }

  canActivateChild(): boolean {
    return this.verificacaoLogin()
  }

  canLoad(): boolean {
    return this.verificacaoLogin()
  }
}
