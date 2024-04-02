import { GestorArquivosService } from '../gestor-arquivos.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { ArquivosVisualizacao } from '../gestor-arquivos.component';
import { formatarTamanho } from 'src/app/core/ts/util';

export interface ArquivoConfig {
  id: any;
  path: string;
  nome: string;
  data: any;
  isDiretorio: boolean;

  extensao?: string;
  formato?: string;
  tamanho?: number;
  hide?: boolean;
}

const FORMATOS_ACESSIVEIS = [
	"audio",
	"imagem",
	"internet",
	"portavel",
	"texto",
	"video",
];

@Component({
  selector: 'app-gestor-arquivo',
  templateUrl: './arquivo.component.html',
  styleUrls: ['./arquivo.component.css']
})
export class GestorArquivoComponent implements OnInit, OnDestroy {

  @Input() config: ArquivoConfig;
  @Input() visualizacao: ArquivosVisualizacao;

  imagem: string;
  data: string;
  horario: string;
  tamanho: string;

  recortado: boolean;

  private subs: Subscription[] = [];

  constructor(
    private gestorArquivosService: GestorArquivosService,
  ) {
    this.subs.push(this.gestorArquivosService.recortado$.subscribe(ids => {
      this.recortado = ids.indexOf(this.config.id) > -1;
    }));
  }

  ngOnInit(): void {
    this.setImagem();
    this.formatarData();

    if (this.config.tamanho) {
      this.tamanho = formatarTamanho(this.config.tamanho);
    }
  }

  acessar(): void {
    if (this.config.isDiretorio) {
      this.gestorArquivosService.acessarDiretorio(this.config.id);
    } else {
      if (this.isAcessivel()) {
        this.gestorArquivosService.acessarArquivo(this.config.path);
      } else {
        this.gestorArquivosService.downloadArquivo(this.config.path);
      }
    }
  }

  abrirOpcoes(e: MouseEvent): void {
    this.gestorArquivosService.abrirOpcoes(e, this.config);
  }

	setImagem() {
    if (!this.config.isDiretorio) {
      if (this.config.formato)
        this.imagem = `assets/img/arquivos/extensoes/icon-ged_${this.config.formato}.svg`;
      else
        this.imagem = 'assets/img/arquivos/extensoes/icon-ged_nao_reconhecido.svg';
    } else {
      this.imagem = 'assets/img/arquivos/extensoes/icon-ged_folder.svg';
    }
	}

  formatarData(): void {
    const mData = moment(this.config.data);
		if (mData.isValid()) {
			this.data = mData.format("DD/MM/YYYY");
			this.horario = mData.format("HH:mm:ss");
		} else {
			this.data = "--";
			this.horario = "--";
		}
  }

  isAcessivel(): boolean {
    return Object.values(FORMATOS_ACESSIVEIS).indexOf(this.config.formato) > -1
      && !this.config.isDiretorio;
  }

  isVisualizacaoBloco(): boolean {
    return this.visualizacao === ArquivosVisualizacao.Bloco;
  }

  ngOnDestroy(): void {
    this.subs.forEach(element => {
      element.unsubscribe();
    });
  }
}
