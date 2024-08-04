import { Observable, Subscription } from 'rxjs';
import { PermissaoService } from '../services/permissao.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class PermissaoGuard  {
  private sub: Subscription;
  private pontoFuncaoSolicitado: string;

  constructor(
    private router: Router, 
    private permissaoService: PermissaoService,
    private tokenService: TokenService
  ) {}

  private verificarPermissao(activatedRoute: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    if (!activatedRoute.data.perfil_id) {
      return true;
    }
    const perfil = this.tokenService.getJwtDecodedAccess().cli_info.cli_info.perfil.perfil_id;

    if (activatedRoute.data.perfil_id.includes(perfil)) {
      return true;
    }

    this.router.navigate(['/403']);
    return false;
  }

  canActivate(activatedRoute: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.verificarPermissao(activatedRoute);
  }

  canActivateChild(activatedRoute: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.verificarPermissao(activatedRoute);
  }

  canLoad(): boolean {
    return false;
  }
}
