import { Subscription } from 'rxjs';
import { GestorArquivosService } from '../gestor-arquivos.service';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, TemplateRef } from '@angular/core';

import * as $ from 'jquery';
import * as moment from 'moment';
import { ArquivoConfig } from '../arquivo/arquivo.component';
import { formatarTamanho } from 'src/app/core/ts/util';
import { DialogModule } from 'primeng/dialog';
import { ModalService } from '../../modal/modal.service';
import { ToastrService } from '../../toastr/toastr.service';

@Component({
  selector: 'app-menu-opcoes-arquivo',
  templateUrl: './menu-opcoes.component.html',
  styleUrls: ['./menu-opcoes.component.css']
})
export class MenuOpcoesArquivoComponent implements OnInit, OnDestroy {

  @Input() diretorio: any;
  @Input() gestor: ElementRef<any>;
  @Input() selecionados: ArquivoConfig[] = [];

  @ViewChild('menu') menu: ElementRef<any>;
  @ViewChild('modalExcluir') modalExcluir: TemplateRef<any>;
  @ViewChild('modalInfo') modalInfo: TemplateRef<any>;

  ativo: boolean;
  largura: number = 180;

  isArquivo: boolean;
  isDiretorio: boolean;
  isColar: boolean;
  isMultiplo: boolean;

  arquivo: ArquivoConfig;
  copiado: any[] = [];
  acao: string;

  bsModal: any;

  arquivoInfo: any;

  private subs: Subscription[] = [];

  constructor(
    private gestorArquivosService: GestorArquivosService,
    private toastrService: ToastrService,
    private modalService: ModalService,
    private dialogModule: DialogModule
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this.gestorArquivosService.opcoes$.subscribe(dados => {
        this.arquivo = dados.arquivo;
        this.isMultiplo = this.selecionados.length > 1;

        if (this.arquivo) {
          this.isArquivo = !this.arquivo.isDiretorio;
          this.isDiretorio = this.arquivo.isDiretorio;
        } else {
          this.isArquivo = false;
          this.isDiretorio = false;
        }

        this.abrir(dados.e);
      }),
      this.gestorArquivosService.movido$.subscribe(dir => {
        this.mover(dir);
      }),
    );

		// $(document).off("click.opcoesarquivo").on("click.opcoesarquivo", function () {
    //   this.fechar();
		// });
  }

  private keyup = (e: KeyboardEvent) => e.key === "Escape" ? this.ativo = false : null;
  private resize = () => this.ativo = false;

  abrir(e: MouseEvent): void {
    window.addEventListener('keyup', this.keyup);
    window.addEventListener('resize', this.resize);

    this.posicionar(e);
    this.ativo = true;
  }

  fechar(): void {
    window.removeEventListener('keyup', this.keyup);
    window.removeEventListener('resize', this.resize);

    this.ativo = false;
  }

  posicionar(e: MouseEvent): void {
    const menu = $(this.menu.nativeElement);
    const clickCoords = this.getPosicao(e);

    if (this.largura > window.innerWidth - clickCoords.x)
      menu.css("left", `${clickCoords.x - this.largura}px`);
    else
      menu.css("left", `${clickCoords.x}px`);

    setTimeout(() => {
      menu.css("top", `${clickCoords.y - (menu.find(".context-menu__item").length * 35 / 2)}px`);
    });
  }

  getPosicao(e: MouseEvent): { x: number, y: number } {
    const rect = this.gestor?.nativeElement?.getBoundingClientRect();
    let posx = 0;
    let posy = 0;

    if (!e) e = window.event as MouseEvent;

    if (e.clientX || e.clientY) {
      posx = e.clientX;
      posy = e.clientY;
    }

    if (rect) {
      posx -= rect.left;
      posy -= rect.top;
    }

    return {
      x: posx,
      y: posy,
    };
  }

  atualizar(): void {
    this.gestorArquivosService.atualizar();
  }

  cadastro(isDiretorio: boolean, id?: any): void {
    this.gestorArquivosService.setCadastro(isDiretorio, id);
  }

  download(): void {
    this.gestorArquivosService.downloadArquivo(this.arquivo.path);
  }

  copiar(): void {
    this.gestorArquivosService.limparRecorte();
    this.isColar = true;

    this.copiado = this.selecionados.map(arq => arq.id);
    this.acao = "copiar";

  }

  recortar(): void {
    this.gestorArquivosService.limparRecorte();
    this.isColar = true;

    this.copiado = this.selecionados.map(arq => arq.id);
    this.acao = "recortar";

    this.gestorArquivosService.recortar(this.copiado);
  }

  mover(diretorio: any): void {
    this.copiado = this.selecionados.map(arq => arq.id);
    this.acao = "recortar";

    this.colar(diretorio);
  }

  colar(diretorio?: any): void {
    let dir = this.diretorio;

    if (diretorio)
      dir = diretorio;
    else if (this.isDiretorio)
      dir = this.arquivo.id;

    this.gestorArquivosService.colar(this.copiado, dir, this.acao).subscribe(res => {
      if (res.status) {

        this.gestorArquivosService.atualizar();

        this.copiado = null;
        this.isColar = false;
      }
    });
  }

  buscarInfo(): void {
    this.gestorArquivosService.buscarArquivo(this.arquivo.id).subscribe(res => {
      if (res.status) {
        if (res.arquivo)
          this.arquivoInfo = res.arquivo;
        else
          this.arquivoInfo = {};

        this.formatInfo();

        this.bsModal = this.dialogModule.constructor(this.modalInfo, {
          class: "modal-lg modal-dialog-centered"
        });
      }
    });
  }

  formatInfo(): void {
    const criacao = moment(this.arquivoInfo.dat_insercao);
    const edicao = moment(this.arquivoInfo.dat_edicao);
    const local = this.arquivoInfo.local;

    if (this.arquivoInfo.tamanho)
      this.arquivoInfo.tamanho = formatarTamanho(this.arquivoInfo.tamanho);

    if (Array.isArray(local)) {
      this.arquivoInfo.local = local.reduce((local, path) => {
        local += `/${path?.nome}`;
        return local;
      }, "");
    } else {
      this.arquivoInfo.local = "--";
    }

    if (criacao.isValid())
      this.arquivoInfo.criacao = criacao.format("DD/MM/YYYY") + " às " + criacao.format("HH:mm:ss");

    if (edicao.isValid())
      this.arquivoInfo.edicao = edicao.format("DD/MM/YYYY") + " às " + edicao.format("HH:mm:ss");

    Object.entries(this.arquivoInfo).forEach(([key, value]) => {
      if (!value) this.arquivoInfo[key] = "--";
    });
  }

  excluir(): void {
    const botoes = [
      {
        label: 'Fechar',
        color: 'secondary',
        atalho: 'Escape',
        shift: true,
        onClick: () => {
          this.modalService.fecharModal()
        },
      },
      {
        label: 'Excluir',
        color: 'danger',
        atalho: 'Enter',
        shift: true,
        onClick: () => {
          this.modalService.fecharModal()
          this.confirmarDeletar()
        },
      }
    ];

    this.modalService.abrirModal(
      `Excluir arquivo${this.isMultiplo ? 's' : ''}`,
      this.modalExcluir,
      botoes,
    );

  }
  confirmarDeletar(): void {
    this.gestorArquivosService.excluirArquivo(
      this.isMultiplo ? this.selecionados.map(arq => arq.id) : [this.arquivo.id]
    ).subscribe(success => {
    if (success.status) {
      this.toastrService.mostrarToastrSuccess(
        "Arquivo/diretório excluído com sucesso!"
      );

      this.gestorArquivosService.atualizar();
    }
  });
}

  ngOnDestroy(): void {
    this.subs.forEach(element => {
      element.unsubscribe();
    });
  }
}
