import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MenuChangeEvent } from '../api/menuchangeevent';
import * as dayjs from "dayjs";
import { HttpClient } from '@angular/common/http';
import { HeaderService } from 'src/app/core/services/header.service';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class MenuService {

    dayjs = dayjs
    private readonly API_BACK = `${environment.API_BACK}`;
    data: any;

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    constructor(private http: HttpClient, private headerService: HeaderService) { }

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    setSessaoPermissoes(value): void {
        this.clearSessaoMenus()
        localStorage.setItem('sessao-permissoes', JSON.stringify(value))
    }

    getSessaoPermissoess(): any {
        return JSON.parse(localStorage.getItem('sessao-permissoes'))
    }

    clearSessaoPermissoes(): void {
        localStorage.removeItem('sessao-permissoes');
    }

    setSessaoMenus(value): void {
        this.clearSessaoMenus()
        localStorage.setItem('sessao-menus', JSON.stringify(value))
    }

    getSessaoMenus(): any {
        return JSON.parse(localStorage.getItem('sessao-menus'))
    }

    clearSessaoMenus(): void {
        localStorage.removeItem('sessao-menus');
    }

    setMenusStorage(value): void {
        this.clearMenuStorage()
        localStorage.setItem('principal', JSON.stringify(value))
    }

    clearMenusStorage(): void {
        localStorage.removeItem('principal');
        localStorage.removeItem('menu-produto');
        localStorage.removeItem('menu-perfil');
        localStorage.removeItem('sub-menu');
    }

    setSubMenuStorage(value): void {
        localStorage.setItem('sub-menu', JSON.stringify(value))
    }

    getSubMenuStorage(): any { 
        return JSON.parse(localStorage.getItem('sub-menu'))
    }

    setProdutosStorage(value): void {
        localStorage.setItem('menu-produto', JSON.stringify(value))
    }

    getProdutosStorage(): any {
        return JSON.parse(localStorage.getItem('menu-produto'))
    }

    setMenuPerfilStorage(value): void {
        localStorage.setItem('menu-perfil', JSON.stringify(value))
    }

    getMenuPerfilStorage(): any {
        return JSON.parse(localStorage.getItem('menu-perfil'))
    }

    setMenuPesquisaStorage(value): void {
        localStorage.setItem('menu-pesquisa', JSON.stringify(value))
    }

    setFavoritosStorage(value): void {
        localStorage.setItem('favoritos', JSON.stringify(value))
    }

    getMenusStorage(): any {
        return JSON.parse(localStorage.getItem('principal'))
    }

    getMenusPesquisaStorage(): any {
        return JSON.parse(localStorage.getItem('menu-pesquisa'))
    }

    getFavoritosStorage(): any {
        return JSON.parse(localStorage.getItem('favoritos'))
    }

    clearMenuStorage(): void {
        localStorage.removeItem('menus');
        localStorage.removeItem('menu-pesquisa');
        localStorage.removeItem('favoritos');
    }

    getMenu(): Observable<any> {
        this.data = {
            menu: 'principal'
        }
        return this.http.get<any>(this.API_BACK + 'menu', {
            headers: this.headerService.getHeader(),
            params: this.data
        });
    }

}
