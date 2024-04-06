import { NavigationEnd, Router } from '@angular/router';
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
  favoritos: Array<any> = [];

  permissoes$: Observable<any>;
  permissoesSolicitadas: string[];
  permissoes: string[] = [];

  dayjs = dayjs;

  visualizarFavoritos: boolean;

  stringPesquisa: string;

  private sessaoMenus: any;
  private sessaoPermissoes: any;

  readonly API = environment.API_BACK;
  readonly TEMPO_ARMAZENAMENTO_SESSAO = environment.TEMPO_ARMAZENAMENTO_SESSAO;

  listaMenus: Array<any> = [];

  parouDigitar: boolean;
  pesquisa: any = [];
  fuzzyMatcherScore: any;

  model: any[] = [];
  modelDefault: any[] = [];
  modelPesquisa: any[] = [];

  menuSubscribe: Subscription;
  subs: Subscription[] = [];

  tipo: string;

  passo: string

  constructor(private menuService: MenuService,
    private permissaoService: PermissaoService,
    private router: Router,
    private modalService: ModalService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private layoutService: LayoutService) {
    this.fuzzyMatcherScore = FuzzyMatcher.scoreValue
  }

  async ngOnInit() {

    this.sessaoMenus = this.menuService.getSessaoMenus()

    this.tipo = this.router.url.split('/')[3]
    this.passo = this.router.url.split('/')[4]

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.tipo = this.router.url.split('/')[3]
      this.passo = this.router.url.split('/')[4]
    });

    const storageSessao = {
      start: this.dayjs().format('YYYY-MM-DD HH:mm'),
      expire: this.dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')
    }

    if (this.sessaoMenus) {
      if (this.dayjs().isAfter(this.dayjs(this.sessaoMenus?.expire))) {
        this.layoutService.dadosMenus$.subscribe((dados) => {
          this.construirMenus(dados);  
        });
        this.menuService.setSessaoMenus(storageSessao)
      } else {
        this.model = this.menuService.getMenusStorage();
        this.modelDefault = this.menuService.getMenusStorage();
      }
    } else {
      this.menuService.setSessaoMenus(storageSessao);
      this.layoutService.dadosMenus$.subscribe((dados) => {
        this.construirMenus(dados);  
      });
    }
    this.pegarPermissoes(this.model);

  }
  
  async construirMenus(dados): Promise<any> {
    if(!dados?.lista_menus) return
    let menus = [];
    const menuLateral = dados.lista_menus
      .filter(menu => menu?.menu_id === 'principal')
      .map(menu => menu.dados);

    menus = this.montarArvore(menuLateral[0])

    this.model = menus?.map(menu => {
      return this.construirMenu(menu)
    })

    this.model = [{
      label: '',
      items: this.model
    }]
    this.modelDefault = this.model
    this.menuService.setMenusStorage(this.model)
  }

  montarArvore(menu : any) : any {
    const menus = [];
    menu.forEach(menu => {
      menus.push({
        icone: `${menu.icone}`,
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

    if (menuItem?.is_favorito) {
      if (this.favoritos[0] && this.favoritos[0].items[0]) {
        this.favoritos[0].items[0].items.push(menuItem)
      } else {
        this.favoritos.push({
          visible: true,
          items: [{
            icon: "pi pi-fw pi-star",
            label: 'Favoritos',
            items: [menuItem]
          }]
        })
      }
    }

    if (!menuItem?.items?.length) {
      this.modelPesquisa.push(menuItem);
    }

    if (menuItem.items.length) {
      menuItem.items = menuItem.items.map(filho => {
        filho.pai_nome = menuItem.label
        return this.construirMenu(filho)
      });
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

  filtrarMenus(ev): void {

    const termoPesquisado = ev?.target?.value
    setTimeout(() => {
      this.parouDigitar = ev?.target?.value === termoPesquisado;
      if (this.parouDigitar) {
        if (!termoPesquisado || termoPesquisado?.length <= 1) {
          this.model = this.modelDefault
        } else {
          this.pesquisa = this.modelPesquisa
            .map((menu) => {
              const string_pesquisa = `${menu?.pai_nome} ${menu?.label}`
              return ({
                value: menu,
                score: this.fuzzyMatcherScore(string_pesquisa, termoPesquisado)
              });
            })
            .sort((a, b) => {
              return (((a.score > b.score) && -1) || ((a.score < b.score) && 1) || 0);
            })
            .slice(0, 20).map((pontuacao) => {
              return (pontuacao.value)
            })

          this.model = [{
            label: '',
            items: this.pesquisa
          }]
        }
      }
    }, 350);

  }

  ngOnDestroy(): void {
    if (this.subs?.length) {
      this.subs.forEach(sub => {
        sub.unsubscribe()
      })
    }
  }

  logout(): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Sair',
      'Deseja sair? Caso prossiga, todas as alterações que não foram salvas serão perdidas.',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.router.navigate(['login']);
        }
      }
    )
  }

}
