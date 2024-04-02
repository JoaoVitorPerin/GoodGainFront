import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(private http: HttpClient) {
  }

  login(form: any): Observable<any> {
    localStorage.removeItem('separador');
    for (const key of Object.keys(localStorage)) {
      if (key.indexOf('cached') > -1) {
        localStorage.removeItem(key);
      }
    }
    this.data = new FormData();
    this.data.append('username', form.usuario.value);
    this.data.append('password', form.senha.value);
    return this.http.post<any>(this.API_BACK + 'login', this.data);
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
