import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';

@Injectable({
  providedIn: 'root'
})
export class LogIntegracaoService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarDados(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'listar_log', {
      headers: this.headerService.getHeader(),
    });
  }

  chamarApi(dados: any){
    return this.http.get<any>(this.API_BACK + 'atualizar_dados', {
        headers: this.headerService.getHeader(),
        params: dados
      });
  }

  buscarDadosHistorico(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'atualizar_events_ocorridos', {
      headers: this.headerService.getHeader(),
    });
  }
}
