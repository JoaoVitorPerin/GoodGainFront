import { environment } from './../../../environments/environment';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  data: any;

  private readonly API_BACK = `${environment.API_BACK}`;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) { }

  atualizarFiliais(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}v1/funcionario/filiais`, {
      headers: this.headerService.getHeader()
    });
  }

  atualizarStatus(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}v1/funcionario/status`, {
      headers: this.headerService.getHeader()
    });
  }

  visualizarSeparadores(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}v1/separacao/separadores`, {
      headers: this.headerService.getHeader()
    });
  }

  buscarTodasFiliais(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}televendas/filiais/buscar`, {
      headers: this.headerService.getHeader()
    });
  }

  atualizarFiliais2(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}funcionario/filial/buscar2`, {
      headers: this.headerService.getHeader()
    });
  }

  atualizarCanais(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}gestao/servico/agendamento/encaixe/local/venda`, {
      headers: this.headerService.getHeader()
    });
  }

  atualizarServicos(cdFilial?): Observable<any> {
    if (cdFilial) {
      this.data = { cd_filial: cdFilial ? cdFilial : null };
    }
    else {
      this.data = {};
    }
    return this.http.get<any>(`${this.API_BACK}gestao/servico/agendamento/produtos/buscar`, {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

}
