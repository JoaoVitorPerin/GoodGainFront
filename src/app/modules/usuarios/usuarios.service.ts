import { HttpClient, HttpContext, HttpContextToken, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from "rxjs";
import { HeaderService } from "src/app/core/services/header.service";
import { environment } from "src/environments/environment";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

    private readonly API_BACK = `${environment.API_BACK}`;
    SKIP_LOADER = SKIP_LOADER;
    data: any;

    constructor(private http: HttpClient, private headerService: HeaderService) { }

    getAllUsers(): Observable<any> {
      return this.http.get<any>(this.API_BACK + 'listar_usuarios', {
        headers: this.headerService.getHeader(),
      });
    }

    getUser(cpf: any): Observable<any> {
      return this.http.get<any>(this.API_BACK + 'cliente', {
        headers: this.headerService.getHeader(),
        params: {cpf: cpf}
      });
    }

    getAcessos(): Observable<any> {
      return this.http.get<any>(this.API_BACK + 'listar_perfis', {
        headers: this.headerService.getHeader(),
      });
    }
    
    setUser(dados: any): Observable<any> {
      return this.http.put<any>(this.API_BACK + 'editar_usuario', dados, {
        headers: this.headerService.getHeader()
      });
    }

    desativarUser(cpf: any): any {
      return this.http.delete<any>(`${this.API_BACK}cliente`, {
        headers: this.headerService.getHeader(),
        params: {cpf: cpf}
      });
    }
}
