import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from '../app.layout.service';
import { environment } from 'src/environments/environment';
import * as dayjs from 'dayjs'
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { title } from "../../ts/util";
import { MenuService } from '../menu/app.menu.service';

@Component({
    selector: 'app-main-asidebar',
    templateUrl: './asidebar.component.html',
    styleUrls: ['./asidebar.oldcomponent.css']
})
export class AppAsideComponent implements OnInit, OnDestroy {

  API_BACK: string = environment.API_BACK

  //TODO: verificar como buscar o nome do funcionário
  funcionario: string = 'Fulano Beltrano'
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

  get visible(): boolean {
      return this.layoutService.state.profileSidebarVisible;
  }

  set visible(_val: boolean) {
      this.layoutService.state.profileSidebarVisible = _val;
  }

  constructor(public layoutService: LayoutService,
              private route: ActivatedRoute,
              private menuService: MenuService) { }

  ngOnInit(): void {
    this.route.params.subscribe(dados => {
      if(dados?.tipo === 'recarga'){
        this.tipo = 'caixa'
      } else {
        this.tipo = dados?.tipo
      }
      this.tipoDescritivo = title(this.tipo)
    })

    this.dataAtual = this.dayjs().format('DD/MM/YYYY')
    
    this.sessaoMenus = this.menuService.getSessaoMenus()

    if (this.sessaoMenus) {
      if (this.dayjs().isAfter(this.dayjs(this.sessaoMenus?.expire))) {
        this.buscarMenus();
      } else {
        this.items = this.menuService.getMenuPerfilStorage()
      }
    } else {
      this.buscarMenus();
    }
  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

  buscarMenus(): void {
    this.layoutService.dadosMenus$.subscribe((dados) => {
      if(dados){
        this.construirMenusHeader(dados, 'perfil')
      }else{
        this.layoutService.getTodosMenus();
      }
    });
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

}
