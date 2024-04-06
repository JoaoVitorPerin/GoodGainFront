import { MenuService } from './../menu/app.menu.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Event, NavigationEnd, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { getIniciais } from "../../ts/util";
import { LayoutService } from '../app.layout.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  showAside: boolean = false;
  showSide: boolean = false;

  tipo: string
  tipoDescritivo: string
  itemsSubMenu: MenuItem[] | [];
  itemsProdutos: MenuItem[] | [];
  steps: MenuItem[] | []
  model: any[] = [];
  modelDefault: any[] = [];
  sessaoMenus: any;
  dayjs = dayjs;

  subs: Subscription[] = []

  //TODO: verificar como buscar o nome do funcionário
  funcionario: string = 'Fulano Beltrano'
  iniciais: string

  validaDashboard: boolean = false

  constructor(
    private layoutService: LayoutService,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.validaDashboard = this.router.url.includes('dashboard');

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.validaDashboard = this.router.url.includes('dashboard');
      }
    });
    
    this.iniciais = getIniciais(this.funcionario)

    // this.subs.push(
    //   this.localService.menu$.subscribe(() => {
    //     this.getStepsDoTipo()
    //   })
    // )
    // this.getStepsDoTipo()

    this.sessaoMenus = this.menuService.getSessaoMenus()

    if (this.sessaoMenus) {
      if (this.dayjs().isAfter(this.dayjs(this.sessaoMenus?.expire))) {
        this.layoutService.dadosMenus$.subscribe((dados) => {
          this.construirMenusHeader(dados, 'submenu')
          this.construirMenusHeader(dados, 'produto')
        });
      } else {
        this.itemsSubMenu = this.menuService.getSubMenuStorage()
        this.itemsProdutos = this.menuService.getProdutosStorage()
      }
    } else {
      this.layoutService.dadosMenus$.subscribe((dados) => {
        this.construirMenusHeader(dados, 'submenu')
        this.construirMenusHeader(dados, 'produto')
      });
    }
  }

  construirMenusHeader(dados, menu_tipo): void {
    if(!dados?.lista_menus) return
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

    if(menu_tipo === 'submenu'){
      this.menuService.setSubMenuStorage(this.model[0].items)
      this.itemsSubMenu = this.model[0].items
    }else{
      this.menuService.setProdutosStorage(this.model)
      this.itemsProdutos = this.model
    }
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
      command: menuItem.command,
      tooltip: menuItem.tooltip,
      items: menuItem.filhos || null,
      pai_nome: menuItem?.pai_nome || null,
      is_favorito: menuItem.is_favorito,
      atalho: menuItem?.atalho,
      alt: menuItem?.alt,
      ctrl: menuItem?.ctrl,
      shift: menuItem?.shift
    }

    if (menuItem.items.length) {
      menuItem.items = menuItem.items.map(filho => {
        filho.pai_nome = menuItem.label
        return this.construirMenu(filho)
      });
    }

    return menuItem
  }


  // getStepsDoTipo(): void {
  //   if(this.tipo === 'caixa'){
  //     this.steps = [
  //       {
  //         label: 'Cliente',
  //         routerLink: `cliente`
  //       },
  //       {
  //         label: 'Produtos',
  //         routerLink: `produtos`
  //       },
  //       {
  //         label: 'Pagamento',
  //         routerLink: `pagamento`
  //       }
  //     ]
  //   } else if(this.tipo === 'pre-venda'){
  //     this.steps = [
  //       {
  //         label: 'Cliente',
  //         routerLink: `cliente`
  //       },
  //       {
  //         label: 'Produtos',
  //         routerLink: `produtos`
  //       }
  //     ]
  //   } else if(this.tipo === 'recarga'){
  //     this.steps = [
  //       {
  //         label: 'Recarga',
  //         routerLink: `recarga`
  //       },
  //       {
  //         label: 'Pagamento',
  //         routerLink: `pagamento`
  //       }
  //     ]
  //   }
  // }

  toggleMenu() {
    this.layoutService.state.sidebarActive = !this.layoutService.state.sidebarActive;
    this.layoutService.onMenuToggle();
  }

  toggleMenuPerfil() {
    this.layoutService.onMenuPerfilToggle();
  }
}
