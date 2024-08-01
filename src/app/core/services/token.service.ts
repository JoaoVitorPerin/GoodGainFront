import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  data: any;
  readonly API_BACK: string = environment.API_BACK

  constructor(private http: HttpClient) {
  }

  getToken(): any {
    return JSON.parse(localStorage.getItem('token'));
  }
  setToken(token: any): void {
    this.clearToken();
    localStorage.setItem('token', JSON.stringify(token));
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  getJwtDecodedAccess(): any {
    try {
      return jwtDecode(this.getToken().access);
    }
    catch (error) {
      //
    }
  }

  getJwtDecodedRefresh(): any {
    try {
      return jwtDecode(this.getToken().refresh);
    }
    catch (error) {
      //
    }
  }


  enviarRefreshToken(token: string): any {
    return this.http.post(`${this.API_BACK}core/login/refresh`, { refresh: token });
  }

  logout(token: string): any {
    return this.http.post(`${this.API_BACK}core/logout`, { refresh: token });
  }

}
