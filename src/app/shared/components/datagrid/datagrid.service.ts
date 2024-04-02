import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
import { HeaderService } from "src/app/core/services/header.service";
import { validarParametros } from "./../../../core/ts/util";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DatagridService {

  data: any;

  SKIP_LOADER = SKIP_LOADER;

  private readonly API_BACK = `${environment.API_BACK}`;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) { }

  buscarDadosTabelaPaginado(parametros, url): Observable<any> {
    this.data = validarParametros(parametros);
    return this.http.get<any>(`${this.API_BACK}${url}`, {
      context: new HttpContext().set(this.SKIP_LOADER, true),
      params: this.data,
      headers: this.headerService.getHeader(),
    })
  }

  buscarDadosColunaPaginado(parametros, url): Observable<any> {
    this.data = validarParametros(parametros);
    return this.http.get<any>(`${this.API_BACK}${url}/coluna`, {
      context: new HttpContext().set(this.SKIP_LOADER, true),
      params: this.data,
      headers: this.headerService.getHeader(),
    })
  }

  gerarRelatorio(urlRelatorio: string, parametros): Observable<any> {
    this.data = validarParametros(parametros);
    return this.http.get<any>(`${this.API_BACK}${urlRelatorio}`, {
      headers: this.headerService.getHeader(),
      params: this.data,
      reportProgress: true
    });
  }
}
