import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HeaderService } from "src/app/core/services/header.service";
import { environment } from "src/environments/environment";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_BACK = `${environment.API_BACK}`;
  SKIP_LOADER = SKIP_LOADER;
  data: any;

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  getHash(): Observable<any> {

    this.data = {};

    return this.http.get<any>(this.API_BACK + 'cadastro/cadastros', {
      headers: this.headerService.getHeader(),
      params: this.data      
    });
  }

  getColunas(hash: string): Observable<any> {

    this.data = {
      hash_cadastro: hash
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/cadastro/tabela', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  getDadosHome(hash: string): Observable<any> {

    this.data = {
      hash_cadastro: hash
    };

    return this.http.get<any>(this.API_BACK + 'cadastro/cadastro/dados', {
      headers: this.headerService.getHeader(),
      params: this.data
    });

  }

  excluirRegistro(hashCadastro: string, pk: string|number, status: boolean): Observable<any> {

    this.data = {
      hash_cadastro: hashCadastro,
      pk,
      status
    };

    return this.http.post<any>(this.API_BACK + 'cadastro/cadastro/status', this.data, {
      headers: this.headerService.getHeader()
    });
  }

  /**
   * Método que retorna todos os menus do sistema
   * @returns Observable<any>
  */
  getMenus(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/menu');
  }

  /**
   * Método que retorna todos os menus items do sistema
   * @returns Observable<any>
  */
  getMenuItem(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/menuitem/cadastro');
  }

  /**
   * Método que retorna um menu item especifico
   * @param menu_id id do menu
   * @returns Observable<any>
  */
  getMenuItemByID(menu_id, menuitem_id): Observable<any> {
    const params = new HttpParams().set('menu_id', menu_id).set('menuitem_id', menuitem_id ? menuitem_id : '');

    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/menuitem/cadastro', { params });
  }

  /**
   * Método que envia que atualiza os menus a partir de um post
   * @returns Observable<any>
  */
  atualizarMenu(): Observable<any> {
    return this.http.post<any>(this.API_BACK + 'core/sistema/configuracao/menu', {headers: this.headerService.getHeader(),});
  }

  /**
   * Método que envia e atualiza os menus a partir de um post
   * @param data dados do menu item
   * @returns Observable<any>
  */
  setMenuItem(data: any): Observable<any> {
    return this.http.post<any>(this.API_BACK + 'core/sistema/configuracao/menuitem/cadastro', JSON.stringify(data), {headers: this.headerService.getHeader({ 'Content-Type': 'application/json' })});
  }

  /**
   * Método que deleta um menu item
   * @param data id do menu item
   * @returns Observable<any>
  */
  deleteMenu(id: string): Observable<any> {
    return this.http.delete<any>(this.API_BACK + 'core/sistema/configuracao/menuitem/cadastro', {
      headers: this.headerService.getHeader(),
      params: {menuitem_id: id}
    });
  }

  /**
   * Método que retorna todas as telas do sistema para a home
   * @returns Observable<any>
  */
  getTelasHome(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/tela/home');
  }

  /**
   * Método que retorna todas as telas do sistema
   * @returns Observable<any>
  */
  getTela(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/tela/cadastro');
  }

  /**
   * Método que retorna uma tela de acordo com o id
   * @param id id da tela
   * @returns Observable<any>
  */
  getTelaByID(id: string): Observable<any> {
    this.data = {
      tela_id: id,
    };

    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/tela/cadastro', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  /**
   * Método que envia uma tela para o backend
   * @param data dados da tela
   * @returns Observable<any>
  */
  setTela(data: any): Observable<any> {
    return this.http.post<any>(this.API_BACK + 'core/sistema/configuracao/tela/cadastro', data);
  }

  /**
   * Método que deleta uma tela
   * @param id id da tela
   * @returns Observable<any>
  */
  deleteTela(id: string): Observable<any> {
    return this.http.delete<any>(this.API_BACK + 'core/sistema/configuracao/tela/cadastro', {
      headers: this.headerService.getHeader(),
      params: {tela_id: id}
    });
  }

  /**
   * Método que retorna todas as versões do sistema para a home
   * @returns Observable<any>
  */
  getVersoesHome(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/tela/versao/home');
  }

  /**
   * Método que retorna todas as versões do sistema
   * @returns Observable<any>
  */
  getVersao(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/tela/versao/cadastro');
  }

  /**
   * Método que retorna uma versão de acordo com o id
   * @param id id da versão
   * @returns Observable<any>
  */
  getVersaoByID(id: string): Observable<any> {
    this.data = {
      versao_id: id,
    };

    return this.http.get<any>(this.API_BACK + 'core/sistema/configuracao/tela/versao/cadastro', {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }

  /**
   * Método que envia uma versão para o backend
   * @param data dados da versão
   * @returns Observable<any>
   */
  setVersao(data: any): Observable<any> {
    return this.http.post<any>(this.API_BACK + 'core/sistema/configuracao/tela/versao/cadastro', data);
  }

  /**
   * Método que deleta uma versão
   * @param id id da versão
   * @returns Observable<any>
   */
  deleteVersao(id: string): Observable<any> {
    return this.http.delete<any>(this.API_BACK + 'core/sistema/configuracao/tela/versao/cadastro', {
      headers: this.headerService.getHeader(),
      params: {versao_id: id}
    });
  }
}