import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HeaderService } from "src/app/core/services/header.service";
import { environment } from "src/environments/environment";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
@Injectable({
  providedIn: 'root'
})
export class AdminGestaoArquivosService {

  private readonly API_BACK = `${environment.API_BACK}`;
  SKIP_LOADER = SKIP_LOADER;
  data: any;

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  getBuscarGrupoHome(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/arquivos/admin_ged/home');
  }

  deleteGrupo(id: string): Observable<any> {
    return this.http.delete<any>(this.API_BACK + 'core/arquivos/admin_ged', {
      headers: this.headerService.getHeader(),
      params: {grupo_id: id}
    });
  }

  getGrupoByID(id: string): Observable<any> {
    this.data = {
      id: id,
    };

    return this.http.get<any>(this.API_BACK + 'core/arquivos/admin_ged', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getCadastroGrupo(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/arquivos/admin_ged');
  }

  setSalvarGrupo(data: any): Observable<any> {
    return this.http.post<any>(this.API_BACK + 'core/arquivos/admin_ged', data);
  }
}
