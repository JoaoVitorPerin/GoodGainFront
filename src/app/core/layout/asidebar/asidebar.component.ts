import { toLocaleFixed } from 'src/app/core/ts/util';
import { TokenService } from './../../services/token.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from '../app.layout.service';
import { environment } from 'src/environments/environment';
import * as dayjs from 'dayjs'
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuService } from '../menu/app.menu.service';
import { HomeSimulacaoService } from 'src/app/modules/home-simulacao/home-simulacao.service';
import { AsidebarService } from '../../services/asidebar.service';

@Component({
    selector: 'app-main-asidebar',
    templateUrl: './asidebar.component.html',
    styleUrls: ['./asidebar.oldcomponent.css']
})
export class AppAsideComponent implements OnInit, OnDestroy {

  API_BACK: string = environment.API_BACK

  funcionario: string = ''
  iniciais: string

  vlrCaixa: number = 0
  limiteSangria: number = 0

  metaDiaria: number = 0
  RealizadoDiario: number = 0
  metaMensal: number = 0
  realizadoMensal: number = 0

  tipo: string;
  tipoDescritivo: string;

  dayjs = dayjs

  dataAtual: string

  subs: Subscription[] = []

  items: any[] = []
  sessaoMenus: any;
  model: any[] = [];
  modelDefault: any[] = [];

  historico: any[] = []

  toLocaleFixed = toLocaleFixed;

  get visible(): boolean {
      return this.layoutService.state.profileSidebarVisible;
  }

  set visible(_val: boolean) {
      this.layoutService.state.profileSidebarVisible = _val;
  }

  constructor(public layoutService: LayoutService,
              private route: ActivatedRoute,
              private menuService: MenuService,
              private tokenService: TokenService,
              private router: Router,
              private simulacaoService: HomeSimulacaoService,
              private asidebarService: AsidebarService,
            ) { }

  ngOnInit(): void {
    this.buscarInfosToken()

    this.buscarDadosHistorico()
    this.asidebarService.triggerHistorico$.subscribe(() => this.buscarDadosHistorico());
  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

  buscarDadosHistorico(){
    this.subs.push(this.simulacaoService.buscarApostasUsuario(this.tokenService.getJwtDecodedAccess().cli_info.cli_info.cpf).subscribe(
      (res: any) => {
        this.historico = res.lista_apostas_cliente;
      },
      (error: any) => {
        console.error(error)
      }
    ))
  }

  construirMenusHeader(dados, menu_tipo): void {
    let menus = [];
    const menusAux = dados.lista_menus
      .filter(menu => menu?.menu_id === menu_tipo)
      .map(menu => menu.dados);

    menus = this.montarArvore(menusAux[0])
    
    this.model = menus?.map(menu => {
      return this.construirMenu(menu)
    })

    this.model = [{
      label: '',
      items: this.model
    }]

    this.modelDefault = this.model

    this.menuService.setMenuPerfilStorage(this.model[0].items)
    this.items = this.model[0].items
  }

  montarArvore(menu : any) : any {
    const menus = [];
    menu.forEach(menu => {
      menus.push({
        icone: `pi pi-fw ${menu.icone}`,
        icon_material: true,
        nome: menu.nome,
        filhos: menu.lista_filhos && Array.isArray(menu.lista_filhos) && menu.lista_filhos.length > 0 ? this.montarArvore(menu.lista_filhos) : [],
        url: menu.url,
      })
    })

    return menus
  }

  construirMenu(menuItem: any): any {

    menuItem = {
      id: menuItem.id,
      menu_pai: menuItem.menuitempai_id,
      label: menuItem.nome,
      icon: menuItem.icone,
      routerLink: menuItem.url,
      items: menuItem.filhos || null,
      pai_nome: menuItem?.pai_nome || null,
    }

    if (menuItem.items.length) {
      menuItem.items = menuItem.items.map(filho => {
        filho.pai_nome = menuItem.label
        return this.construirMenu(filho)
      });
    }

    return menuItem
  }

  toggleMenuConfiguracoes() {
      this.layoutService.showConfigSidebar()
  }

  buscarInfosToken(){
    const token = this.tokenService.getJwtDecodedAccess()
    this.funcionario = `${token.cli_info.cli_info.nome} ${token.cli_info.cli_info.sobrenome}`
  }

  perfil(){
    this.router.navigate(['/perfil'])
  }

  logout(){
    this.router.navigate(['/logout'])
  }

  reduzirNomeClube(nome){
    const splitName = nome.split(' ');
    const longestName = splitName.reduce((longest, currentWord) => currentWord.length > longest.length ? currentWord : longest, '');

    return longestName;
  }
}
