import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarPreferencias(cpf): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'preferencias', {
        headers: this.headerService.getHeader(),
        params: {cpf: cpf}
    });
  }
}
