import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HeaderService } from 'src/app/core/services/header.service';
import { ArquivoConfig } from './arquivo/arquivo.component';
import { UploadConfig } from './modal-cadastro/modal-cadastro.component';

@Injectable({
  providedIn: 'root'
})
export class GestorArquivosService {

  private data: any;
  private readonly API_BACK = `${environment.API_BACK}`;

  private _root = new Subject<any>();
  root$ = this._root.asObservable();

  private _initCadastro = new Subject<any>();
  initCadastro$ = this._initCadastro.asObservable();

  private _fimCadastro = new Subject<void>();
  fimCadastro$ = this._fimCadastro.asObservable();

  private _atualizar = new Subject<string>();
  atualizar$ = this._atualizar.asObservable();

  private _opcoes = new Subject<{ e: MouseEvent, arquivo?: ArquivoConfig }>();
  opcoes$ = this._opcoes.asObservable();

  private _recortado = new Subject<any[]>();
  recortado$ = this._recortado.asObservable();

  private _movido = new Subject<any>();
  movido$ = this._movido.asObservable();

  private _customButton = new Subject<string>();
  customButton$ = this._customButton.asObservable();

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  setRoot(id?: any): void {
    this._root.next(id);
  }

  setCadastro(isDiretorio: boolean, id?: any): void {
    this._initCadastro.next({ id, isDiretorio });
  }

  finalizarcadastro(): void {
    this._fimCadastro.next();
  }

  atualizar(): void {
    this._atualizar.next(".");
  }

  acessarDiretorio(diretorio: any): void {
    this._atualizar.next(diretorio);
  }

  abrirOpcoes(e: MouseEvent, arquivo?: ArquivoConfig): void {
    e.preventDefault();
    e.stopPropagation();
    this._opcoes.next({ e, arquivo });
  }

  recortar(ids: any[]): void {
    this._recortado.next(ids);
  }

  limparRecorte(): void {
    this._recortado.next([]);
  }

  mover(diretorio: any): void {
    this._movido.next(diretorio);
  }

  clickCustom(btn: string): void {
    this._customButton.next(btn);
  }

	acessarArquivo(path: string): void {
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.target = '_blank';
		link.href = `${path}`;
		link.click();
		document.body.removeChild(link);
	}

	downloadArquivo(path: string): void {
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.target = '_blank';
		link.download = "";
		link.href = `${path}`;
		link.click();
		document.body.removeChild(link);
	}

  buscarArquivos(diretorio?: any): Observable<any> {
    this.data = {};
    if (diretorio) this.data.diretorio_id = diretorio;

    return this.http.get<any>(`${this.API_BACK}core/arquivos/buscar/todos`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarArquivo(id?: any): Observable<any> {
    this.data = {};
    if (id) this.data.arquivo_id = id;

    return this.http.get<any>(`${this.API_BACK}core/arquivos/editar`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  salvarArquivo(id: any, isDiretorio: boolean, diretorioPai: any, dados: any, params: any, arquivo: File, novoNome?: string, extensao?: string): Observable<any> {
    this.data = new FormData();
    this.data.append("is_diretorio", isDiretorio);
		if (diretorioPai) this.data.append("diretorio_pai_id", diretorioPai);
    if (id && !novoNome) this.data.append("arquivo_id", id);

    Object.entries(dados).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length) this.data.append(key, value);
      } else {
        if (value || value === 0) this.data.append(key, value);
      }
    });

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length) this.data.append(key, value);
        } else {
          if (value || value === 0) this.data.append(key, value);
        }
      });
    }

    if (arquivo) {
      if (novoNome) {
        this.data.append("lista_arquivos", arquivo, novoNome + extensao ?? '');
      } else {
        this.data.append("lista_arquivos", arquivo);
      }
    }

    return this.http.post<any>(`${this.API_BACK}core/arquivos/editar`, this.data, {
      headers: this.headerService.getHeader()
    });
  }

  salvarArquivos(id: any, isDiretorio: boolean, diretorioPai: any, dados: any, params: any, arquivos: UploadConfig[], novoNome?: string): Observable<any> {
    this.data = new FormData();
    this.data.append("is_diretorio", isDiretorio);
		if (diretorioPai) this.data.append("diretorio_pai_id", diretorioPai);
    if (id) this.data.append("arquivo_id", id);

    Object.entries(dados).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length) this.data.append(key, value);
      } else {
        if (value || value === 0) this.data.append(key, value);
      }
    });

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length) this.data.append(key, value);
        } else {
          if (value || value === 0) this.data.append(key, value);
        }
      });
    }

    arquivos.forEach(arq => {
      this.data.append("lista_arquivos", arq.file);
    });

    return this.http.post<any>(`${this.API_BACK}core/arquivos/editar`, this.data, {
      headers: this.headerService.getHeader()
    });
  }

  colar(ids: any[], diretorio: any, acao: string): Observable<any> {
    this.data = new FormData();
    this.data.append("lista_arquivos", ids);
    this.data.append("diretorio_id", diretorio);

    switch (acao) {
      case "recortar":
        return this.http.post<any>(`${this.API_BACK}core/arquivos/mover`, this.data, {
          headers: this.headerService.getHeader()
        });
      default:
        return this.http.post<any>(`${this.API_BACK}core/arquivos/copiar`, this.data, {
          headers: this.headerService.getHeader()
        });
    }
  }

  excluirArquivo(ids: any[]): Observable<any> {
    this.data = new HttpParams().set("lista_arquivos", ids.join(','));

    return this.http.delete<any>(`${this.API_BACK}core/arquivos/editar`, {
      headers: this.headerService.getHeader(),
      params: this.data
    });
  }
}
