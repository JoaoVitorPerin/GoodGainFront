import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from 'src/app/core/services/header.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly API_BACK = `${environment.API_BACK}`;

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  buscarRoot(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}core/arquivos/buscar/root`, {
      headers: this.headerService.getHeader(),
    });
  }
}
