import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HeaderService } from '../services/header.service';
import { environment } from 'src/environments/environment';
import { MenuService } from './menu/app.menu.service';

export type MenuMode = 'static' | 'overlay' | 'horizontal' | 'slim' | 'slim-plus' | 'reveal' | 'drawer';

export type ColorScheme = 'light' | 'dark' | 'dim';

export type MenuColorScheme = 'colorScheme' | 'primaryColor' | 'transparent';

export interface AppConfig {
  inputStyle: string;
  colorScheme: ColorScheme;
  theme: string;
  ripple: boolean;
  menuMode: MenuMode;
  scale: number;
  menuTheme: MenuColorScheme;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
  sidebarActive: boolean;
  anchored: boolean,
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  API_BACK = environment.API_BACK;

  data: any;

  config: AppConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'indigo',
    scale: 14,
    menuTheme: 'colorScheme'
  };

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    sidebarActive: false,
    anchored: false
  };

  private configUpdate = new Subject<AppConfig>();
  configUpdate$ = this.configUpdate.asObservable();

  private overlayOpen = new Subject<any>();
  overlayOpen$ = this.overlayOpen.asObservable();

  toggleMenu = new Subject<any>();
  toggleMenu$ = this.toggleMenu.asObservable();

  favoritos = new Subject<any>();
  favoritos$ = this.favoritos.asObservable();

  private dadosMenus = new BehaviorSubject<any>(null);
  dadosMenus$ = this.dadosMenus.asObservable();

  constructor(
    private http: HttpClient,
    private headerService: HeaderService,
    private menuService: MenuService
  ) { }

  onMenuToggle() {
    this.toggleMenu.next(null);

    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;

      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
    }
    else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  onOverlaySubmenuOpen() {
    this.overlayOpen.next(null);
  }

  onMenuPerfilToggle() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
  }

  showConfigSidebar() {
    this.state.configSidebarVisible = true;
  }

  isOverlay() {
    return this.config.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isSlim() {
    return this.config.menuMode === 'slim';
  }

  isSlimPlus() {
    return this.config.menuMode === 'slim-plus';
  }

  isHorizontal() {
    return this.config.menuMode === 'horizontal';
  }

  isMobile() {
    return !this.isDesktop();
  }

  isFullScreen() {
    return window.innerWidth == screen.width && window.innerHeight == screen.height
  }

  onConfigUpdate() {
    this.configUpdate.next(this.config);
  }

  setSessaoVersaoTela(value): void {
    this.clearSessaoVersaoTela()
    localStorage.setItem('sessao-versao-telas', JSON.stringify(value))
  }

  getSessaoVersaoTela(): any {
    return JSON.parse(localStorage.getItem('sessao-versao-telas'))
  }

  clearSessaoVersaoTela(): void {
    localStorage.removeItem('sessao-versao-telas');
  }

  setVersoesTelasStorage(value): void {
    this.clearVersoesTelasStorage()
    localStorage.setItem('versoes-telas', JSON.stringify(value))
  }

  getVersoesTelasStorage(): any {
    return JSON.parse(localStorage.getItem('versoes-telas'))
  }

  getVersaoTelaStorage(url: string): string {
    const versoesTelas = this.getVersoesTelasStorage()
    if (versoesTelas?.length) {
      const versaoTela = versoesTelas?.find(tela => { return tela.url === url })
      if (versaoTela?.versao) {
        return versaoTela.versao
      }
    }
    return ''
  }

  clearVersoesTelasStorage(): void {
    localStorage.removeItem('versoes-telas');
  }

  buscarVersoesTelas(): Observable<any> {
    return this.http.get<any>(this.API_BACK + 'versao-tela', {
      headers: this.headerService.getHeader()
    });
  }

  atualizarFavorito(item){
    this.favoritos.next(item)
  }

  gerenciarFavorito(id: number, decisao: boolean): Observable<any> {

    this.data = {
      id: id,
      is_favoritar: decisao
    }

    return this.http.post<any>(this.API_BACK + 'gerenciar-favorito', {
      headers: this.headerService.getHeader()
    });
  }

  setPersonalizacao(value): void {
    this.clearPersonalizacao()
    localStorage.setItem('personalizacao', JSON.stringify(value))
  }

  getPersonalizacao(): any {
    return JSON.parse(localStorage.getItem('personalizacao'))
  }

  clearPersonalizacao(): void {
    localStorage.removeItem('personalizacao');
  }

  limparSessaoUsuario() {
   this.menuService.clearMenuStorage();
   this.menuService.clearSessaoMenus();
   this.clearVersoesTelasStorage();
    window.location.href = '/'
  }

}
