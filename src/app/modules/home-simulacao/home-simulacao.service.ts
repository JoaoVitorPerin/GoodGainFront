import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';
import * as mocDados from 'src/assets/mocDados.json'

@Injectable({
  providedIn: 'root'
})
export class HomeSimulacaoService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarCampeonato(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'campeonato', {
      headers: this.headerService.getHeader()
    });
  }

  buscarTimePorCampeonato(campeonato_id: any): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'times/championship', {
      headers: this.headerService.getHeader(),
      params: {campeonato_id: campeonato_id}
    });
  }

  enviarSimulacao(data: any): Observable<any> {
    return this.http.post<any>(this.API_BACK + 'simular/aposta', data, {
      headers: this.headerService.getHeader()
    });
  }

  buscarApostasUsuario(cpf:any): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'historico/apostas/cliente', {
      headers: this.headerService.getHeader(),
      params: {cpf_user: cpf}
    });
  }
}
