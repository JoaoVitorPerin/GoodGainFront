import { Subscription } from 'rxjs';
import { GestorArquivosService } from './gestor-arquivos.service';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PermissaoService } from 'src/app/core/services/permissao.service';
import { inOutAnimation } from 'src/app/core/animations';
import { ArquivoConfig } from './arquivo/arquivo.component';
import { SelectionBoxService } from '../selection-box/selection-box.service';

export enum ArquivosVisualizacao {
  Lista = "lista",
  Bloco = "bloco",
}

interface DiretorioPath {
  id: any;
  nome: string;
}

@Component({
  selector: 'app-gestor-arquivos',
  templateUrl: './gestor-arquivos.component.html',
  styleUrls: ['./gestor-arquivos.component.css'],
  animations: [inOutAnimation]
})
export class GestorArquivosComponent implements OnInit, OnDestroy {

  @ViewChild('gestor') gestorRef: ElementRef<any>;

  @ViewChild('modalCadastro') modalCadastro: TemplateRef<any>;
  isDiretorio: boolean;
  arquivoId: boolean;

  @Input() params: any;
  @Input() customButtons: {
    id: string,
    tooltip: string,
    icon: string,
    classes: string,
  }[] = [];

  root: string;
	diretorio: string;
	paths: DiretorioPath[] = [];
  arquivos: ArquivoConfig[] = [];

  selecionados: ArquivoConfig[] = [];

	historico = {
		prev: [],
		next: []
	}

  visualizacao: ArquivosVisualizacao = ArquivosVisualizacao.Lista;
  termo: string = '';

  permissoes: string[] = [];

  loading: boolean;
  semResultados: boolean;

  private subs: Subscription[] = [];
  private searchTimer: NodeJS.Timeout;

  constructor(
    private gestorArquivosService: GestorArquivosService,
    private permissaoService: PermissaoService,
    private selectionBoxService: SelectionBoxService,
    private cdr: ChangeDetectorRef
  ) {
    this.subs.push(
      this.gestorArquivosService.root$.subscribe(diretorio => {
        this.root = diretorio;
        this.atualizar(diretorio);
      }),
      this.gestorArquivosService.atualizar$.subscribe(diretorio => {
        this.atualizar(diretorio);
      }),
      this.selectionBoxService.$selected.subscribe(ids => {
        this.selecionados = this.selecionarArquivos(ids);
        this.cdr.detectChanges();
      }),
      this.selectionBoxService.$dropped.subscribe(id => {
        const dir = this.arquivos.find(arq => arq.id == id);

        if (dir && dir.isDiretorio)
          this.gestorArquivosService.mover(dir.id);
      }),
    );
  }

  ngOnInit(): void {
    this.permissaoService.solicitarPermissao([
    ]).subscribe((dados) => {
      this.permissoes = dados.pf_liberados;
    });
  }

	atualizar(diretorio?: any, historico?: string) {
		// Usar o "." como diretorio caso apenas queira recarregar o diretorio atual
		if (diretorio === '.') {
			diretorio = this.diretorio;
		} else {
			if (!diretorio)
				diretorio = this.root;

			this.checkHistorico(historico);
			this.diretorio = diretorio;
		}

    this.arquivos = [];
    this.termo = '';
    this.loading = true;
    this.semResultados = false;
    this.gestorArquivosService.buscarArquivos(diretorio).subscribe(
      res => {
        this.loading = false;

        if (res.status) {
          if (Array.isArray(res.lista_arquivos)) {
            for (const arq of res.lista_arquivos) {
              this.arquivos.push(this.formatarArquivo(arq));
            }
          }

          if (Array.isArray(res.lista_path)) {
            this.paths = res.lista_path.reverse();
          }
        } else {
          this.paths = [];
        }
      },
      error => {
        this.loading = false;
      }
    );
	}

  formatarArquivo(arq: any): ArquivoConfig {
    return {
      id: arq['id'],
      path: arq['arquivo'],
      nome: arq['nome'],
      extensao: arq['extensao'],
      formato: arq['formato'],
      tamanho: arq['tamanho'],
      data: arq['dat_edicao'] ?? arq['dat_insercao'],
      isDiretorio: arq['is_diretorio']
    }
  }

  selecionarArquivos(ids: any[]): ArquivoConfig[] {
    return this.arquivos.filter(arq => ids.indexOf(arq.id?.toString()) > -1);
  }

	checkHistorico(historico: string): void {
		if (historico === "prev") {
			this.historico.prev.shift();
			this.historico.next.unshift(this.diretorio);
		} else if (historico === "next") {
			this.historico.next.shift();
			this.historico.prev.unshift(this.diretorio);
		} else if (historico !== "init") {
			this.historico.prev.unshift(this.diretorio);
			this.historico.next = [];
		}
	}

	voltar() {
		this.atualizar(this.historico.prev[0], "prev");
	}

	avancar() {
		this.atualizar(this.historico.next[0], "next");
	}

  abrirCadastro(isDiretorio: boolean, id?: any): void {
    this.gestorArquivosService.setCadastro(isDiretorio, id);
  }

	abrirOpcoesArquivo(e: MouseEvent) {
    if (!this.loading) this.gestorArquivosService.abrirOpcoes(e);
	}

	alterarVisualizacao() {
		if (this.isVisualizacaoBloco()) {
			this.visualizacao = ArquivosVisualizacao.Lista;
		} else {
			this.visualizacao = ArquivosVisualizacao.Bloco;
		}
	}

  isVisualizacaoBloco(): boolean {
    return this.visualizacao === ArquivosVisualizacao.Bloco;
  }

  pesquisar() {
    const ref = this;

		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(function () {
			if (ref.termo && !ref.loading) {
				const arquivos = ref?.arquivos?.filter(arq => {
           arq.hide = typeof arq.nome === "string" && arq.nome.indexOf(ref?.termo) === -1;
          return !arq.hide;
        });

        this.semResultados = !arquivos?.length;
			} else {
				ref.arquivos.forEach(arq => {
          arq.hide = false;
        });

        this.semResultados = false;
			}
		}, 300);
	}

  clickCustom(id: string): void {
    this.gestorArquivosService.clickCustom(id);
  }

  ngOnDestroy(): void {
    this.subs.forEach(element => {
      element.unsubscribe();
    });
  }
}
