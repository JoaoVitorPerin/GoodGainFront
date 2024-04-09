import { environment } from 'src/environments/environment';
import { TokenService } from './../services/token.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard  {

  readonly API_BACK: string = environment.API_BACK

  constructor(private tokenService: TokenService) { }

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
