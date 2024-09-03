import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';
import * as mocDados from 'src/assets/mocDados.json'

@Injectable({
  providedIn: 'root'
})
export class HomeConfrontosService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarDados(){
    return mocDados;
  }

  buscarProximosConfrontos(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'futuros/eventos', {
      headers: this.headerService.getHeader(),
    });
  }

  buscarProximosConfrontosByUserPreference(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'home_info_usuarios', {
      headers: this.headerService.getHeader(),
    });
  }
}
