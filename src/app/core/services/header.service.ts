import { environment } from './../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private readonly API = `${environment.API_BACK}`;

  private headers: HttpHeaders;

  acesso: string = '';

  constructor(private tokenService: TokenService) {
  }

  getHeader(adicionais?): any {

    if(this.tokenService?.getToken())
      this.acesso = `Bearer ${this.tokenService?.getToken().access ? this.tokenService?.getToken().access : ''}`;

    this.headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: this.acesso,
      ...adicionais
    }); 

    return this.headers;
  }
}
