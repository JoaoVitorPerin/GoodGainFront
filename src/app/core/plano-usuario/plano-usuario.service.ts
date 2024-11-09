import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';

@Injectable({
  providedIn: 'root'
})
export class PlanoUsuarioService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  enviarPlanoUsuario(data: any): Observable<any> {
    return this.http.post<any>(this.API_BACK + 'selecionar_plano', data, {
      headers: this.headerService.getHeader()
    });
  }
}
