import { Component, Input, OnInit } from '@angular/core';
import { ColorScheme, LayoutService, MenuColorScheme, MenuMode } from '../app.layout.service';
import { MenuService } from '../menu/app.menu.service';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html'
})
export class AppConfigComponent implements OnInit {

  @Input() minimal: boolean = false;

  componentThemes: any[] = [];

  scales: number[] = [];

  larguraTela: number

  constructor(public layoutService: LayoutService, public menuService: MenuService) {
    this.larguraTela = window.innerWidth;

    if(this.larguraTela){
      if(this.larguraTela <= 600){
        this.scales = [9, 10, 11, 12, 13]
      } else if(this.larguraTela <= 1024){
        this.scales = [11, 12, 13, 14, 15]
      } else if(this.larguraTela <= 1360) {
        this.scales = [12, 13, 14, 15, 16]
      } else if (this.larguraTela <= 1920){
        this.scales = [16, 17, 18, 19, 20]
      } else {
        this.scales = [18, 19, 20, 21, 22]
      }
    }

  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }

  set scale(_val: number) {
    this.layoutService.config.scale = _val;
  }

  get menuMode(): MenuMode {
    return this.layoutService.config.menuMode;
  }

  set menuMode(_val: MenuMode) {
    this.layoutService.config.menuMode = _val;
    if (this.layoutService.isSlimPlus() || this.layoutService.isSlim() || this.layoutService.isHorizontal()) {
      this.menuService.reset();
    }
  }

  get colorScheme(): ColorScheme {
    return this.layoutService.config.colorScheme;
  }

  set colorScheme(_val: ColorScheme) {
    this.changeColorScheme(_val);
  }

  get inputStyle(): string {
    return this.layoutService.config.inputStyle;
  }

  set inputStyle(_val: string) {
    this.layoutService.config.inputStyle = _val;
  }

  get ripple(): boolean {
    return this.layoutService.config.ripple;
  }

  set ripple(_val: boolean) {
    this.layoutService.config.ripple = _val;
  }

  get menuTheme(): MenuColorScheme {
    return this.layoutService.config.menuTheme;
  }

  set menuTheme(_val: MenuColorScheme) {
    this.layoutService.config.menuTheme = _val;
  }

  ngOnInit() {
    this.componentThemes = [
      { name: 'indigo', color: '#6366F1' },
      { name: 'blue', color: '#3B82F6' },
      { name: 'purple', color: '#8B5CF6' },
      { name: 'teal', color: '#14B8A6' },
      { name: 'cyan', color: '#06b6d4' },
      { name: 'green', color: '#10b981' },
      { name: 'orange', color: '#FF8201' },
      { name: 'pink', color: '#d946ef' }
    ];

    const personalizacao = this.layoutService.getPersonalizacao();
    if (personalizacao) {
      if (personalizacao.tema) {
        this.changeTheme(personalizacao.tema);
      }
      if (personalizacao.escala) {
        this.scale = personalizacao.escala;
        this.applyScale();
      }
      // if (personalizacao.cor) {
      //     this.changeColorScheme(personalizacao.cor);
      // }
    } else {
      // this.layoutService.setPersonalizacao({ tema: 'cyan', escala: 16 });
      // this.changeTheme('cyan');
    }
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  changeColorScheme(colorScheme: ColorScheme) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-link');
    const themeLinkHref = themeLink.getAttribute('href');
    const currentColorScheme = 'theme-' + this.layoutService.config.colorScheme;
    const newColorScheme = 'theme-' + colorScheme;
    const newHref = themeLinkHref!.replace(currentColorScheme, newColorScheme);
    this.replaceThemeLink(newHref, () => {
      this.layoutService.config.colorScheme = colorScheme;
      this.layoutService.onConfigUpdate();
    });
    this.personalizar('cor', colorScheme);
  }

  changeTheme(theme: string) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-link');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
    this.replaceThemeLink(newHref, () => {
      this.layoutService.config.theme = theme;
      this.layoutService.onConfigUpdate();
    });

    this.personalizar('tema', theme);
  }

  replaceThemeLink(href: string, onComplete: () => void) {
    const id = 'theme-link';
    const themeLink = <HTMLLinkElement>document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
    this.personalizar('escala', this.scale);
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
    this.personalizar('escala', this.scale);
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
    //document.documentElement.style.fontSize = 14 + 'px';
  }

  personalizar(config, valor) {
    const personalizacao = this.layoutService.getPersonalizacao();
    personalizacao[config] = valor;
    this.layoutService.setPersonalizacao(personalizacao);
  }

}
