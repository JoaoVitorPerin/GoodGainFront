import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HeaderService } from "src/app/core/services/header.service";
import { environment } from "src/environments/environment";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
@Injectable({
  providedIn: 'root'
})
export class CadastroGenericoService {

  private readonly API_BACK = `${environment.API_BACK}`;
  SKIP_LOADER = SKIP_LOADER;
  data: any;

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  getAbas(hashCadastro: string): Observable<any> {

    this.data = {
      hash_cadastro: hashCadastro
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/abas', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getCampos(hashAba: string): Observable<any> {

    this.data = {
      hash_aba: hashAba
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/aba/campos', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getDados(hashCadastro: string, hashAba: string, cadastroId?: any): Observable<any> {

    this.data = {
      hash_cadastro: hashCadastro,
      hash_aba: hashAba,
      pk: cadastroId
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/aba/dados', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getDadosMestreDetalhe(hashCampo: string, hashCadastro: string, cadastroId: number|string): Observable<any> {

    this.data = {
      hash_campo: hashCampo,
      hash_cadastro: hashCadastro,
      pk: cadastroId
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/aba/dados/mestre-detalhe', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getOpcoes(hashCampo: string): Observable<any> {

    this.data = {
      hash_campo: hashCampo,
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/aba/campos/opcoes', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getInformacoesAdicionais(hashCampo: string, valorCampo, url): Observable<any> {
    this.data = {
      hash_campo: hashCampo,
      valor_campo: valorCampo
    };

    return this.http.get<any>(this.API_BACK + url, {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getSugestoes(hashColuna: string, termo: string): Observable<any> {
    this.data = {
      hash_coluna: hashColuna,
      termo
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/aba/campos/completar', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  submitDados(dados: any): Observable<any> {

    this.data = {
      ...dados
    };

    return this.http.post<any>(this.API_BACK + 'cadastro/aba/dados', JSON.stringify(this.data), {
      headers: this.headerService.getHeader({'Content-Type': 'application/json'})
    });
  }

}
