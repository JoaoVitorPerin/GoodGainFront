import { ViaCEP } from '../models/viacep.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  constructor(private http: HttpClient) { }

  buscarEndereco(cep: string): Observable<ViaCEP> {
    cep = cep.replace(/-/g, '').replace(/\./, '');
    const URL = `https://viacep.com.br/ws/${cep}/json`;
    return this.http.get<ViaCEP>(URL);
  }
}
