import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { MenuService } from './app.menu.service';
import { environment } from 'src/environments/environment';
import * as dayjs from "dayjs";
import { Observable, Subscription, lastValueFrom, filter } from 'rxjs';
import { PermissaoService } from 'src/app/core/services/permissao.service';
import { FuzzyMatcher } from "../../ts/util";
import { ModalService } from "src/app/shared/components/modal/modal.service";
import { ModalConfirmacaoService } from "src/app/shared/components/modal-confirmacao/modal-confirmacao.service";
import { LayoutService } from '../app.layout.service';
import { menuItem } from 'src/app/shared/models/menu-item.model';
import { MenuItem } from 'primeng/api';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.css'],
})
export class AppMenuComponent implements OnInit, OnDestroy {

  @ViewChild('modalMeta') modalMeta: TemplateRef<any>;
  @ViewChild('modalMenus') modalMenus: TemplateRef<any>;
  @ViewChild('modalPreVenda') modalPreVenda: TemplateRef<any>;

  data: any;

  permissoes$: Observable<any>;
  permissoesSolicitadas: string[];
  permissoes: string[] = [];

  dayjs = dayjs;

  private sessaoPermissoes: any;

  readonly API = environment.API_BACK;
  readonly TEMPO_ARMAZENAMENTO_SESSAO = environment.TEMPO_ARMAZENAMENTO_SESSAO;

  listaMenus: Array<any> = [];

  pesquisa: any = [];
  fuzzyMatcherScore: any;
  menus: MenuItem[] = [];
  model: any[] = [];
  modelDefault: any[] = [];
  modelPesquisa: any[] = [];

  menuSubscribe: Subscription;
  subs: Subscription[] = [];

  tipo: string;

  passo: string

  constructor(private menuService: MenuService,
    private permissaoService: PermissaoService,
    private tokenService: TokenService,
    private router: Router,
    private modalService: ModalService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private layoutService: LayoutService) {
    this.fuzzyMatcherScore = FuzzyMatcher.scoreValue
  }

  ngOnInit() {
    const perfil = this.tokenService.getJwtDecodedAccess().cli_info.cli_info.perfil.perfil_id;

    if(['gratuito', 'premium', 'Vip', 'admin'].includes(perfil)){
      this.menus.push(
        {
          "label": "Simulação",
          "icon": "ifl",
          "routerLink": "simulacao",
        },
      )
    }
    
    if(['premium', 'Vip', 'admin'].includes(perfil)){
      this.menus.push(
        {
          "label": "Próximos confrontos",
          "icon": "emergency_heat",
          "routerLink": "confrontos",
        }
      )
    }

    if(['Vip', 'admin'].includes(perfil)){
      this.menus.push(
        {
          "label": "Dashboard",
          "icon": "monitoring",
          "routerLink": "dashboard",
        },
      )
    }

    if(['admin'].includes(perfil)){
      this.menus.push(
        {
          "label": "Admin Usuários",
          "icon": "person",
          "routerLink": "usuarios",
        },
      )
    }

    if(['admin'].includes(perfil)){
      this.menus.push(
        {
          "label": "Log API",
          "icon": "sync_alt",
          "routerLink": "log-api",
        },
      )
    }

    this.construirMenus(this.menus)
  }
  
  construirMenus(dados){
    let menus = [];
    menus = this.montarArvore(dados)
    this.model = menus?.map(menu => {
      return this.construirMenu(menu)
    })

    this.model = [{
      label: '',
      items: this.model
    }]

    this.modelDefault = this.model
  }

  montarArvore(menusItems : any) : any {
    const menus = [];
    menusItems.forEach(menu => {
      menus.push({
        icone: `${menu.icon}`,
        icon_material: true,
        nome: menu.label,
        filhos: menu.lista_filhos && Array.isArray(menu.lista_filhos) && menu.lista_filhos.length > 0 ? this.montarArvore(menu.lista_filhos) : [],
        url: menu.routerLink,
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
    return menuItem
  }

  async pegarPermissoes(data: any): Promise<any> {

    if (!data?.length)
      return

    for (const dado of data) {
      if (dado.pontofuncao_id) {
        this.permissoesSolicitadas.push(dado.pontofuncao_id);
      }
      if (dado.items.length > 0) {
        this.pegarPermissoes(dado.items);
      }
    }

    if (this.permissoesSolicitadas?.length) {
      await this.buscarPermissoes()
    }
  }

  async buscarPermissoes(): Promise<any> {

    this.sessaoPermissoes = this.menuService.getSessaoPermissoess()

    const storageSessao = {
      start: this.dayjs().format('YYYY-MM-DD HH:mm'),
      expire: this.dayjs().add(this.TEMPO_ARMAZENAMENTO_SESSAO, 'm').format('YYYY-MM-DD HH:mm')
    }

    if (this.sessaoPermissoes) {
      if (this.dayjs().isAfter(this.dayjs(this.sessaoPermissoes?.expire))) {
        this.permissoes = this.permissaoService.getPermissoesStorage()
      }
    } else {
      this.menuService.setSessaoPermissoes(storageSessao);
      await lastValueFrom(this.permissaoService.solicitarPermissoes()).then(dados => {
        if (dados.status) {
          this.permissoes = dados.pf_liberados
          this.permissaoService.setPermissoesStorage(this.permissoes)
        }
      })
    }
  }

  verificarPermissao(string: string): boolean {
    return string ? this.permissoes.indexOf(string) > -1 : true;
  }

  tirarShow(data: any): void {
    for (const dado of data) {
      if (dado.show) {
        dado.show = false;
      }
      if (dado.items.length > 0) {
        this.tirarShow(dado.items);
      }
    }
  }

  toggleDrop(event, item, itens): void {
    const isShow = item.show;
    event.stopPropagation();
    this.tirarShow(itens);
    item.show = !isShow;
  }

  ngOnDestroy(): void {
    if (this.subs?.length) {
      this.subs.forEach(sub => {
        sub.unsubscribe()
      })
    }
  }
}
