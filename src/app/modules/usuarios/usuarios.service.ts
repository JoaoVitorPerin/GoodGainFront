import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from "rxjs";
import { HeaderService } from "src/app/core/services/header.service";
import { environment } from "src/environments/environment";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

    private readonly API_BACK = `${environment.API_BACK}`;
    SKIP_LOADER = SKIP_LOADER;
    data: any;

    constructor(private http: HttpClient, private headerService: HeaderService) { }

    /**
     * Retorna as informações dos usuários
     * @returns Observable<any>
    */
    getInfosUsuarios(): Observable<any> {
        return this.http.get<any>(this.API_BACK + 'core/user/home');
    }

    /**
     * Retorna o usuário com id passado no parametro
     * @param id matricula do usuário
     * @returns Observable<any>
    */
    getUsuarioById(id: string): Observable<any>{
        this.data = {
            matricula: id,
        };
      
        return this.http.get<any>(this.API_BACK + 'core/user/cadastro', {
            headers: this.headerService.getHeader(),
            params: this.data
        });
    }

    /**
     * Atualiza as informações do usuário
     * @param dados informações do usuário
     * @returns Observable<any>
    */
    setUsuario(dados: any): Observable<any>{
        return this.http.post<any>(this.API_BACK + 'core/user/cadastro', JSON.stringify(dados), {headers: this.headerService.getHeader({ 'Content-Type': 'application/json' })});
    }

    /**
     * Deleta o usuário com id passado no parametro
     * @param id matricula do usuário
     * @returns Observable<any>
    */
    deleteUsuario(id: number){
        //TODO: Implementar a deleção de um usuário
        return id
    }
    
    /**
     * Retorna as informações dos grupos
     * @returns Observable<any>
    */
    getInfosGrupos(): Observable<any> {
        return this.http.get<any>(this.API_BACK + 'core/user/grupo/home');
    }

    /**
     * Retorna o grupo com nome passado no parametro
     * @param nome nome do grupo
     * @returns Observable<any>
    */
    getGrupoByName(nome: string): Observable<any>{
        this.data = {
            nome: nome,
        };
      
        return this.http.get<any>(this.API_BACK + 'core/user/grupo/cadastro', {
            headers: this.headerService.getHeader(),
            params: this.data
        });
    }

    /**
     * Atualiza as informações do grupo
     * @param dados informações do grupo
     * @returns Observable<any>
    */
    setGrupo(dados: any): Observable<any>{
        return this.http.post<any>(this.API_BACK + 'core/user/grupo/cadastro', JSON.stringify(dados), {headers: this.headerService.getHeader({ 'Content-Type': 'application/json' })});
    }

    /**
     * Retorna as informações dos perfis
     * @returns Observable<any>
    */
    getPerfis(): Observable<any> {
        return this.http.get<any>(this.API_BACK + 'core/user/perfil/home');
    }

    /**
     * Retorna as informações gerais do perfil
     * @returns Observable<any>
    */
    getPerfilInfos(): Observable<any> {
        return this.http.get<any>(this.API_BACK + 'core/user/perfil/cadastro', {
            headers: this.headerService.getHeader(),
        });
    }

    /**
     * Retorna o perfil com nome passado no parametro
     * @param nome nome do perfil
     * @returns Observable<any>
    */
    getPerfilByName(nome: string): Observable<any>{
        this.data = {
            nome: nome,
        };
      
        return this.http.get<any>(this.API_BACK + 'core/user/perfil/cadastro', {
            headers: this.headerService.getHeader(),
            params: this.data
        });
    }
    
    /**
     * Atualiza as informações do perfil
     * @param dados informações do perfil
     * @returns Observable<any>
    */
    setPerfil(dados: any): Observable<any>{
        return this.http.post<any>(this.API_BACK + 'core/user/perfil/cadastro', JSON.stringify(dados), {headers: this.headerService.getHeader({ 'Content-Type': 'application/json' })});
    }
}