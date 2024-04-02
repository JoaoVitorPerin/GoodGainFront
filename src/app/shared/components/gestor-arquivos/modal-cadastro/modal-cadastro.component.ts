import { ModalService } from './../../modal/modal.service';
import { Subscription } from 'rxjs';
import { GestorArquivosService } from '../gestor-arquivos.service';
import { Component, Input, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../../toastr/toastr.service';
import { ArquivoConfig } from '../arquivo/arquivo.component';
import { FilePondOptions } from 'filepond';

export interface UploadConfig {
  id: any;
  nome: string;
  file: File;
  extensao: string;
}

interface ArquivoConflito {
  existe: boolean;
  isNovoNome: FormControl;
  novoNome: string;

  uploadConfig?: UploadConfig;
}

@Component({
  selector: 'app-modal-cadastro-arquivo',
  templateUrl: './modal-cadastro.component.html',
  styleUrls: ['./modal-cadastro.component.css']
})
export class ModalCadastroArquivoComponent implements OnInit, OnDestroy {

  @ViewChild('modalCadastro') modalCadastro: TemplateRef<any>;
  @ViewChild('modalNome') modalNome: TemplateRef<any>;

  @Input() diretorio: any;
  @Input() arquivos: ArquivoConfig[];
  @Input() params: any = {};

  id: any;
  isDiretorio: boolean;

  bsModal: any;


  pondOptions: FilePondOptions = {
		allowMultiple: false,
    maxFiles: 10,
		instantUpload: true,
		allowImagePreview: false,
		server: {
			process: (fieldName, file, metadata, load, error, progress) =>
				this.upload(file as File, load, progress),
			revert: (uniqueFileId, load, error) => {
				error('Erro');
				load();

        const index = this.arquivosUpload.indexOf(uniqueFileId);
        if (index > -1)
          this.arquivosUpload.splice(index, 1);
			},
      load: (source, load) => {
        const req = new Request(source);
        fetch(req).then(function(response) {
          response.blob().then(function(myBlob) {
            load(myBlob);
          });
        });
      }
		},
    labelFileLoading: 'Carregando',
    labelFileProcessing: 'Carregando',
    labelTapToCancel: 'Clique para cancelar',
    labelFileProcessingComplete: 'Upload completo',
    labelTapToUndo: 'Clique para remover',
    labelButtonRemoveItem: 'Remover',
    labelIdle: '<p class="small"><img src="assets/img/icons/icon_upload02.svg" width="40" style="height:30px" alt=""></p><p class="font-sm small">Arraste o arquivo aqui ou</p> <a class="btn btn-outline-secondary btn-sm font-sm small py-0 mb-2">Selecione do seu dispositivo</a>',
  };

  pondFiles: any[] = [];

  arquivosUpload: UploadConfig[] = [];
  conflitos: UploadConfig[] = [];
  conflito: ArquivoConflito = {
    existe: false,
    isNovoNome: this.fb.control(false),
    novoNome: null,
  };

  diretorioInvalido: boolean;

  form: FormGroup;
  formInit: boolean;

  opcoes: any = {
    "escrita-funcionarios": [],
    "escrita-cargos": [],
    "escrita-filiais": [],
    "escrita-areas": [],
    "escrita-grupos": [],
    "escrita-grupos-ged": [],
    "leitura-funcionarios": [],
    "leitura-cargos": [],
    "leitura-filiais": [],
    "leitura-areas": [],
    "leitura-grupos": [],
    "leitura-grupos-ged": [],
  };

  private subs: Subscription[] = [];
  private subFim: Subscription;

  constructor(
    private gestorArquivosService: GestorArquivosService,
    private toastrService: ToastrService,
    private modalService: ModalService,
    private fb: FormBuilder,
  ) {
    this.subs.push(
      this.gestorArquivosService.initCadastro$.subscribe(dados => {
        this.id = dados.id;
        this.isDiretorio = dados.isDiretorio;

        this.abrirCadastro();
      })
    )
  }

  ngOnInit(): void {
    this.initForm();
    this.subs.push(this.conflito.isNovoNome.valueChanges.subscribe(value => {
      if (!value) {
        this.conflito.novoNome = null;
        this.conflito.existe = false;
      }
    }));
  }

  initForm(): void {
    this.form = this.fb.group({
      nome: [null],
      periodo_alerta: [null],
      vencimento: [null],
      descricao: [null, Validators.required],

      // Específicos da filial
      enviar_alerta_distribuidor: [false],

      "escrita-funcionarios": [[]],
      "escrita-cargos": [[]],
      "escrita-filiais": [[]],
      "escrita-areas": [[]],
      "escrita-grupos": [[]],
      "escrita-grupos-ged": [[]],
      "leitura-funcionarios": [[]],
      "leitura-cargos": [[]],
      "leitura-filiais": [[]],
      "leitura-areas": [[]],
      "leitura-grupos": [[]],
      "leitura-grupos-ged": [[]],
    });

    this.subs.push(this.form.get('nome').valueChanges.subscribe(nome => {
      this.diretorioInvalido = this.arquivos.some(arq => arq.id !== this.id && arq.isDiretorio && arq.nome === nome);
    }));
  }

  abrirCadastro(): void {
    this.pondOptions.allowMultiple = !this.id;

    if (this.isDiretorio || this.id)
      this.getDadosArquivo(this.id);

      const botoes = [
      ]
    this.modalService.abrirModal('Cadastro/Edição de Arquivos',this.modalCadastro, botoes, {larguraDesktop: '80'});

    this.resetCadastro();
    this.subFim = this.gestorArquivosService.fimCadastro$.subscribe(() => {
      this.finalizarCadastro();
    });
  }

  getDadosArquivo(id: any): void {
    this.gestorArquivosService.buscarArquivo(id).subscribe(res => {
      if (res.status) {
        this.addOpcoes(res.lista_funcionarios, "escrita-funcionarios", "id", "nm_descritivo");
        this.addOpcoes(res.lista_cargos?.cargos, "escrita-cargos", "id", "nm_descritivo");
        this.addOpcoes(res.lista_filiais?.filiais, "escrita-filiais", "id", "nm_descritivo");
        this.addOpcoes(res.lista_areas?.area, "escrita-areas", "id", "nm_descritivo");
        this.addOpcoes(res.lista_grupos, "escrita-grupos", "id", "nm_descritivo");
        this.addOpcoes(res.lista_grupos_ged, "escrita-grupos-ged", "id", "nm_grupo");

        this.addOpcoes(res.lista_funcionarios, "leitura-funcionarios", "id", "nm_descritivo");
        this.addOpcoes(res.lista_cargos?.cargos, "leitura-cargos", "id", "nm_descritivo");
        this.addOpcoes(res.lista_filiais?.filiais, "leitura-filiais", "id", "nm_descritivo");
        this.addOpcoes(res.lista_areas?.area, "leitura-areas", "id", "nm_descritivo");
        this.addOpcoes(res.lista_grupos, "leitura-grupos", "id", "nm_descritivo");
        this.addOpcoes(res.lista_grupos_ged, "leitura-grupos-ged", "id", "nm_grupo");

        if (res.arquivo) {
          Object.entries(res.arquivo).forEach(([key, value]) => {
            const control = this.form.get(key);
            if (control) control.patchValue(value);
          });

          const permissoes = res.arquivo.permissoes;
          if (permissoes) {
            this.setPermissoesSelecionadas("funcionarios", permissoes.lista_funcionarios);
            this.setPermissoesSelecionadas("cargos", permissoes.lista_cargos);
            this.setPermissoesSelecionadas("filiais", permissoes.lista_filiais);
            this.setPermissoesSelecionadas("areas", permissoes.lista_areas);
            this.setPermissoesSelecionadas("grupos", permissoes.lista_grupos);
            this.setPermissoesSelecionadas("grupos-ged", permissoes.lista_grupos_ged);
          }

          if (res.arquivo.arquivo) {
            this.form.get("nome").setValue(null);

            this.pondFiles = [{
              source: `media/${res.arquivo.arquivo}`,
              options: { type: "local" }
            }];
          }
        }
      }

      this.formInit = true;
    });
  }

  setPermissoesSelecionadas(select: string, selecionados: any[]): void {
    ['escrita', 'leitura'].forEach(permissao => {
      const filtrados = Array.isArray(selecionados) ? selecionados.reduce((lista, op) => {
        if (op[`is_${permissao}`]) lista.push(op.id);
        return lista;
      }, []) : [];
      this.form.get(`${permissao}-${select}`)?.patchValue(filtrados);
    });
  }

  addOpcoes(opcoes: any, campo: string, chave: string, label: string): void {
    if (Array.isArray(opcoes)) {
      this.opcoes[campo] = opcoes.reduce((lista, op) => {
        if (op[label]) lista.push({ value: op[chave], label: op[label] });
        return lista;
      }, []);
    } else {
      this.opcoes[campo] = [];
    }
  }

  upload(file: File, load: any, progress: any): void {
    this.verificarUpload(file);

    progress(true, 2, 2);
    load(file.name);
  }

  verificarUpload(file: File): void {
    const arquivo = this.arquivos.find(arq => `${arq.nome}${arq.extensao}` === file.name);
    const config: UploadConfig = {
      id: null,
      nome: file.name,
      file: file,
      extensao: file.name.slice(file.name.lastIndexOf(".")),
    };

    if (arquivo) {
      config.id = arquivo.id;
      this.conflitos.push(config);
    } else {
      this.arquivosUpload.push(config);
    }
  }

  resetCadastro(): void {
    if (this.subFim) this.subFim.unsubscribe();

    this.pondFiles = [];
    this.arquivosUpload = [];
    this.resetConflito();

    this.form.reset();
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid && !(this.isDiretorio && this.diretorioInvalido)) {
      this.gestorArquivosService.salvarArquivos(
        this.id,
        this.isDiretorio,
        this.diretorio,
        this.form.getRawValue(),
        this.params,
        this.arquivosUpload,
      ).subscribe(res => {
        if (res.status) {
          if (this.conflitos.length) {
            this.proximoConflito();
          } else {
            this.toastrService.mostrarToastrSuccess(
              'Sucesso',
              `${this.isDiretorio ? "Pasta" : "Arquivo(s)"} salvo(s) com sucesso.`
            );
            this.gestorArquivosService.finalizarcadastro();
          }
        }
      });
    } else {
      this.toastrService.mostrarToastrDanger('Ocorreu um erro ao salvar, verifique os campos em vermelho.');
    }
  }

  proximoConflito(): void {
    if (this.conflitos.length) {
      this.bsModal.hide();

      this.conflito = {
        ...this.conflito,
        existe: false,
        novoNome: null,
        uploadConfig: this.conflitos[0],
      };

      this.conflitos.splice(this.conflitos.indexOf(this.conflito.uploadConfig), 1);
      this.conflito.isNovoNome.setValue(false);

      this.bsModal = this.modalService.constructor(this.modalNome, {
        class: "modal-lg modal-dialog-scrollable modal-dialog-centered",
        ignoreBackdropClick: true
      });
    } else {
      this.gestorArquivosService.finalizarcadastro();
    }
  }

	verificarNome(nome: string): void {
    this.conflito.existe = this.arquivos.some(arq => !arq.isDiretorio && `${arq.nome}${arq.extensao}` === nome);
	}

  resetConflito(): void {
    this.conflitos = [];
    this.conflito = {
      ...this.conflito,
      existe: false,
      novoNome: null,
      uploadConfig: null,
    };

    this.conflito.isNovoNome.setValue(false);
  }

  resolverConflito(): void {
    if (this.conflito.isNovoNome.value && !this.conflito.novoNome) {
      this.toastrService.mostrarToastrPrimary("Preencha um nome novo nome para o arquivo");
      return;
    }

    if (!this.conflito.existe) {
      this.gestorArquivosService.salvarArquivo(
        this.conflito.uploadConfig.id,
        this.isDiretorio,
        this.diretorio,
        this.form.getRawValue(),
        this.params,
        this.conflito.uploadConfig.file,
        this.conflito.novoNome,
        this.conflito.uploadConfig.extensao
      ).subscribe(res => {
        if (res.status) {
          this.toastrService.mostrarToastrSuccess(
            'Sucesso',
            `${this.isDiretorio ? "Pasta" : "Arquivo"} salvo com sucesso.`
          );
          this.proximoConflito();
        }
      });
    } else {
      this.toastrService.mostrarToastrPrimary("Preencha um nome válido para o arquivo");
    }
  }

  finalizarCadastro(): void {
    this.resetCadastro();
    this.gestorArquivosService.atualizar();
    this.bsModal.hide();
  }

  ngOnDestroy(): void {
    this.subs.forEach(element => {
      element.unsubscribe();
    });
    this.subFim?.unsubscribe();
  }
}
