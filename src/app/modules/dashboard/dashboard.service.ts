import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';
import * as mocDados from 'src/assets/mocDados.json'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarDados(cpf: any): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'dashboard', {
      headers: this.headerService.getHeader(),
      params: {cpf_user: cpf}
    });
  }
}
