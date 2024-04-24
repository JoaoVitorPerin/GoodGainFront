import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  login(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}login`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  cadastro(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}cliente`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarUserByCpf(cpf: any): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'cliente', {
      headers: this.headerService.getHeader(),
      params: {cpf: cpf}
  });
  }

  editarUser(dados: any): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.put<any>(`${this.API_BACK}cliente`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  redefinirSenha(form: any): any {
    const data = new FormData();
    data.append('matricula', form.matriculaId);
    data.append('password', form.newSenha);
    data.append('password_confirmacao', form.newSenhaRepeat);
    return this.http.post<any>(this.API_BACK + 'reset/senha', data);
  }

  solicitarResetSenha(form: any): any{
    this.data = {}
    this.data.matricula = form.usuarioSenhaResetada
    this.data.senha_padrao = form.passwordPadraoSenhaResetada
    return this.http.post<any>(this.API_BACK + 'nova/senha', this.data);
  }
}
