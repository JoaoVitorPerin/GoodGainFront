import { HeaderService } from './header.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PermissaoService {

  data: any;

  private readonly API_BACK = `${environment.API_BACK}`;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) { }

  setPermissoesStorage(value): void {
    this.clearPermissoesStorage()
    localStorage.setItem('permissoes', JSON.stringify(value))
  }

  getPermissoesStorage(): any {
    return JSON.parse(localStorage.getItem('permissoes'))
  }

  clearPermissoesStorage(): void {
    localStorage.removeItem('permissoes');
  }

  solicitarPermissao(permissoesSolicitadas: string[]): Observable<any> {
    this.data = { pf_requeridos: permissoesSolicitadas };
    return this.http.get<any>(`${this.API_BACK}funcionario/pontofuncao/buscar`, {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  solicitarPermissoes(): Observable<any> {
    this.data = {};
    return this.http.get<any>(`${this.API_BACK}funcionario/pontofuncao/buscar/todos`, {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }
}
