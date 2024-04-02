import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { datagridConfigDefault } from 'src/app/core/ts/datagridConfigDefault';
import { FormGroup, FormBuilder, ValidatorFn, Validators, FormArray } from '@angular/forms';
import { CadastroGenericoService } from './cadastro-generico.service';
import { AdminService } from './../admin.service';
import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, lastValueFrom } from "rxjs";
import { TabViewChangeEvent } from "primeng/tabview";
import { criarCamposCadastroArvore, getFormAdminInfos, title } from "../../../core/ts/util";
import * as dayjs from 'dayjs';
import { ModalConfirmacaoService } from "src/app/shared/components/modal-confirmacao/modal-confirmacao.service";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import { environment } from 'src/environments/environment';
dayjs.extend(customParseFormat)

@Component({
  selector: 'app-cadastro-generico',
  templateUrl: './cadastro-generico.component.html',
  styleUrls: ['./cadastro-generico.component.css'],
  animations: []
})
export class CadastroGenericoComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];

  homeId: string
  cadastroId: string
  hash: string;

  subsNavigate: Subscription;

  abas: Array<any> = [];
  campos: Array<any> = [];
  dados: Array<any> = [];

  abaAtiva: object = {}

  formulario: FormGroup;
  configuracoes = datagridConfigDefault();

  loader = signal(false);
  isMinimizado = signal(false);
  isFormularioMaximizado = signal(false);

  dayjs = dayjs;

  isFormAlterado: boolean = false;
  isMobile: boolean = false;

  timer: any;

  opcoesPesquisa: any[] = []

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private cadastroGenericoService: CadastroGenericoService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private layoutService: LayoutService
  ) {
    this.isMobile = this.layoutService.isMobile();
  }

  async ngOnInit(): Promise<any> {
    if (this.subsNavigate) {
      this.subsNavigate.unsubscribe()
    }

    this.subsNavigate = this.activatedRoute.params.subscribe(
      async dados => {

        this.homeId = dados?.homeId
        if (!this.homeId)
          this.homeId = this.router.url.split('/')[2]

        this.cadastroId = dados?.id;
        if (!this.cadastroId)
          this.cadastroId = this.activatedRoute.data['value']?.id

        await this.getHash();
        this.abaAtiva = {}
        this.subsCadastro();

      }
    );

  }

  ngOnDestroy(): void {
    this.subs.forEach(element => {
      element.unsubscribe();
    });
  }

  async subsCadastro(): Promise<any> {

    this.subs.forEach(element => {
      element.unsubscribe();
    });

    await this.getAbas()

    this.loader.set(true)

    await Promise.all([
      this.getCampos(),
      this.getDados()
    ]).then(() => {
      this.loader.set(false)
      this.construirFormulario()
    })

  }

  async getHash(): Promise<any> {
    await lastValueFrom(this.adminService.getHash()).then(dados => {
      if (dados.status) {
        if (dados.lista_cadastros?.length) {
          let paginaCadastro = dados.lista_cadastros?.find((cad) => cad.nome === this.homeId)
          if (paginaCadastro?.hash)
            this.hash = paginaCadastro.hash
        }
      } else {
        this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível buscar os dados do cadastro. Hash Error')
      }
    }).catch(_err => {
      this.toastrService.mostrarToastrDanger('Não foi possível buscar os dados do cadastro. Hash Error')
    })
  }

  async getAbas(): Promise<any> {
    await lastValueFrom(this.cadastroGenericoService.getAbas(this.hash)).then(dados => {
      if (dados.status) {
        if (dados?.lista_abas?.length)
          this.abas = dados?.lista_abas?.sort((a, b) => a.ordem - b.ordem)

        if (!Object.keys(this.abaAtiva)?.length) {
          this.abaAtiva = this.abas[0]
        }

      } else {
        this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível buscar os dados do cadastro. Tab Error')
      }
    }).catch(_err => {
      this.toastrService.mostrarToastrDanger('Não foi possível buscar os dados do cadastro. Tab Error')
    })
  }

  async getCampos(hashAba?: string): Promise<any> {

    return new Promise(async resolve => {

      if (!hashAba) {
        if (this.abas?.length) {
          hashAba = this.abas[0]?.hash
        } else {
          return
        }
      }

      this.campos = []

      await lastValueFrom(this.cadastroGenericoService.getCampos(hashAba)).then(async dados => {
        if (dados.status) {
          if (dados?.lista_campos?.length) {
            this.campos = dados?.lista_campos?.sort((a, b) => a.ordem - b.ordem)
            await this.tratamentoCampos()
          }
        } else {
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível buscar os dados do cadastro. Fields Error')
        }
      }).catch(_err => {
        this.toastrService.mostrarToastrDanger('Não foi possível buscar os dados do cadastro. Fields Error')
      })

      resolve(true)
    })

  }

  async getDados(hashAba?: string): Promise<any> {

    return new Promise(async resolve => {

      if (!this.cadastroId) {
        resolve(true)
        return
      }

      if (!hashAba) {
        if (this.abas?.length) {
          hashAba = this.abas[0]?.hash
        } else {
          resolve(true)
          return
        }
      }

      this.dados = []

      await lastValueFrom(this.cadastroGenericoService.getDados(this.hash, hashAba, this.cadastroId)).then(dados => {
        if (dados.status) {
          if (Object?.keys(dados?.dict_dados)?.length)
            this.dados = dados?.dict_dados
        } else {
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível buscar os dados do cadastro. Data Error')
        }
      }).catch(_err => {
        this.toastrService.mostrarToastrDanger('Não foi possível buscar os dados do cadastro. Data Error')
      })

      resolve(true)
    })

  }

  construirFormulario(): void {

    if (this.formulario?.value && Object.keys(this.formulario?.value)?.length) {
      for (let campo in this.formulario?.value) {
        this.formulario.removeControl(campo)
      }
      this.formulario?.updateValueAndValidity()
    }

    let jsonCampos = {}

    if (this.campos?.length) {
      this.campos?.map(campo => {

        if (!campo?.hash_pai) {
          let valor = null
          let validators: ValidatorFn[] = []

          if (campo?.configuracao_geral?.is_obrigatorio) {
            if (campo.tipo == 'checkbox') {
              validators.push(Validators.requiredTrue)
            } else {
              validators.push(Validators.required)
            }
          }

          if (this.cadastroId && Object?.keys(this.dados)?.length && (this.dados[campo?.hash] || this.dados[campo?.hash] === 0)) {
            valor = this.dados[campo?.hash]

            if (campo?.configuracao_geral?.tipo === 'date') {
              valor = this.dayjs(this.dados[campo?.hash], 'YYYY-MM-DD').format('DD/MM/YYYY')
            }

            if (campo?.configuracao_geral?.is_multiplas_opcoes) {
              valor = !Array.isArray(this.dados[campo?.hash]) ? [this.dados[campo?.hash]] : this.dados[campo?.hash]
            }

          }

          if (campo?.configuracao_geral?.tipo === 'cadastroArvore') {
            if (!this.dados[campo?.hash]) {
              this.dados[campo?.hash] = [{}]
            }

            jsonCampos[campo?.hash] = this.formBuilder.array([])
            this.dados[campo?.hash].forEach(valor => {
              jsonCampos[campo?.hash].push(this.preecherValoresCadastroArvore(valor));
            })
          } else {
            jsonCampos[campo?.hash] = [valor ?? null, validators]
          }

        }
      })
    }

    this.formulario = this.formBuilder.group(jsonCampos)

    this.verificarFormularioAlterado();

    this.verificarConfiguracoesFormulario();
  }

  async alterarAbaAtiva(ev: TabViewChangeEvent): Promise<any> {

    let hashAba = null;

    if (ev?.index || ev?.index === 0) {
      hashAba = this.abas[ev?.index]?.hash
      this.abaAtiva = this.abas[ev?.index]
    }

    this.loader.set(true)

    await Promise.all([
      this.getCampos(hashAba),
      this.getDados(hashAba)
    ]).then(() => {
      this.loader.set(false)
      this.construirFormulario();
    })

  }

  async tratamentoCampos(): Promise<any> {
    return new Promise(resolve => {
      if (this.campos?.length) {
        this.campos?.map(async campo => {

          let configuracao = campo?.configuracao_geral

          campo['hash'] = campo?.hash_coluna ?? campo?.hash_campo

          if (configuracao?.tipo === 'tabela') {
            configuracao['configuracoes'] = this.configuracoes
          }

          if (configuracao?.tipo === 'mestreDetalhe') {

            configuracao['configuracoes'] = this.configuracoes
            configuracao['configuracoes']['addRow'] = true

            let campos = this.campos?.filter((c) => { return c?.hash_pai === campo?.hash_campo })
            if (campos.length) {
              let colunas = []
              campos?.map(col => {
                let hash = col?.hash_coluna ?? col?.hash_campo
                colunas.push({
                  dataField: hash,
                  caption: col?.configuracao_geral?.caption,
                  dataType: col?.configuracao_geral?.dataType ?? 'string',
                  visible: col?.configuracao_geral?.visible ?? true,
                  cellTemplate: col?.configuracao_geral?.cellTemplate
                })
              })

              configuracao['colunas'] = colunas
              configuracao.configuracoes.acoes.push({
                icon: 'pi pi-trash',
                color: 'danger',
                tooltip: 'Excluir Item',
                text: '',
                is_excluir: true,
                click: (data) => { }
              })
            }

            if (this.cadastroId) {
              await this.buscarDadosMestreDetalhe(campo?.hash_campo, campo?.hash)
            }
          }

          if (configuracao?.tipo === 'cadastroArvore') {
            let campos = this.campos?.filter((c) => { return c?.hash_pai === campo?.hash_campo })
            configuracao['campos'] = campos;
          }

          if (configuracao?.is_buscar_opcoes) {
            this.buscarDados(configuracao, campo?.hash_campo, campo.hash_coluna, campo?.hash_pai)
          }

        })
        resolve(true)
      }
    })
  }

  buscarDados(configuracao: any, hash: string, hash_coluna?: string, hash_pai?: string): void {
    configuracao['opcoes'] = []

    if (!hash)
      return

    this.cadastroGenericoService.getOpcoes(hash).subscribe({
      next: (dados) => {
        if (dados.status) {
          if (dados?.opcoes?.length) {
            configuracao['opcoes'] = dados?.opcoes

            if (configuracao?.tipo == 'dualist') {
              configuracao['opcoes_selecionadas'] = this.formulario.value[hash_coluna]?.map(selecionado => {
                return configuracao['opcoes']?.find(item => item.value == selecionado)
              })
              configuracao['opcoes'] = configuracao['opcoes'].filter(item => {
                return !this.formulario.value[hash_coluna].find(selecionado => {
                  return selecionado == item.value
                })
              })
            }

            if (hash_pai) {
              let opcoesMestreDetalhes = []
              opcoesMestreDetalhes.push({
                dataField: hash_coluna,
                opcoes: dados?.opcoes
              })
              this.campos.find(campo => campo.hash_campo === hash_pai).configuracao_geral.configuracoes.opcoes = opcoesMestreDetalhes
            }
          }
        }
      }, error: (_err) => { }
    })

  }

  atualizarOpcoes(event, campo): void {
    this.buscarDados(campo?.configuracao_geral, campo?.hash_campo, campo?.hash_coluna, campo?.hash_pai)
  }

  async buscarDadosMestreDetalhe(hashCampo: string, hashForm: string): Promise<any> {
    return new Promise(resolve => {
      this.cadastroGenericoService.getDadosMestreDetalhe(hashCampo, this.hash, this.cadastroId).subscribe({
        next: (dados) => {
          if (dados.status) {
            if (dados.dict_dados?.length) {
              this.dados[hashForm] = dados.dict_dados
              this.formulario?.get(hashForm)?.setValue(dados.dict_dados)
            }
          }
        }, error: (_err) => { },
        complete: () => {
          resolve(true)
        }
      })
    })
  }

  changeSelect(event, { configuracao_geral, hash }): void {
    if (event && event?.value) {
      if (configuracao_geral?.tipo == 'select' && configuracao_geral?.is_buscar_informacoes && configuracao_geral?.url) {
        this.subs.push(
          this.cadastroGenericoService.getInformacoesAdicionais(hash, event?.value, configuracao_geral?.url).subscribe({
            next: dados => {
              if (dados.status) {
                if (dados?.informacoes) {
                  this.formulario.setValue(dados.informacoes, { emitEvent: false })
                }
              }
            }
          }
          ));
      }
    }
  }

  changeCheckbox(valor, { configuracao_geral, hash }): void {
    const checked = valor;
    const configuracoes = ['bloquear', 'ocultar', 'exibir'];

    configuracoes.forEach(configuracao => {
      if (configuracao_geral?.[configuracao]) { //configuracao_geral.bloquear
        const { verdadeiro: camposChecked, falso: camposNaoChecked } = configuracao_geral[configuracao];
        const camposParaAcao1 = checked ? camposChecked : camposNaoChecked;
        const camposParaAcao2 = checked ? camposNaoChecked : camposChecked;

        switch (configuracao) {
          case 'bloquear':
            this.bloquearCampos(camposParaAcao1, camposParaAcao2);
            break;
          case 'ocultar':
            this.ocultarCampos(camposParaAcao1, camposParaAcao2);
            break;
          case 'exibir':
            this.ocultarCampos(camposParaAcao2, camposParaAcao1);
            break;
        }
      }
    });
  }

  ocultarCampos(camposParaOcultar, camposParaMostrar) {
    const atualizarCampo = (campo, is_invisivel) => {
      let ref = this.campos.find(c => c.hash_coluna === campo);
      if (!ref) return;
  
      ref.configuracao_geral.is_invisivel = is_invisivel;
  
      let campoFormulario = this.formulario.get(campo);
      if (is_invisivel) {
        campoFormulario.setValue(null);
        campoFormulario.clearValidators();
      } else if (ref.configuracao_geral?.is_obrigatorio) {
        campoFormulario.setValidators([Validators.required]);
      }
  
      campoFormulario.updateValueAndValidity();
    }
    camposParaOcultar?.forEach(campo => atualizarCampo(campo, true));
    camposParaMostrar?.forEach(campo => atualizarCampo(campo, false));
  }

  bloquearCampos(camposParaBloquear, camposParaDesbloquear) {
    const atualizarCampo = (campo, is_bloquear) => {
      let ref = this.campos.find(c => c.hash_coluna === campo);
      if (!ref) return;
  
      ref.configuracao_geral.readonly = is_bloquear;
  
      let campoFormulario = this.formulario.get(campo);
      if (is_bloquear) {
        campoFormulario.setValue(null);
        campoFormulario.clearValidators();
      } else if (ref.configuracao_geral?.is_obrigatorio) {
        campoFormulario.setValidators([Validators.required]);
      }
  
      campoFormulario.updateValueAndValidity();

    }
    camposParaBloquear?.forEach(campo => atualizarCampo(campo, true));
    camposParaDesbloquear?.forEach(campo => atualizarCampo(campo, false));
  }

  pesquisaGenerica(campo) {
    this.opcoesPesquisa = []
    let valorCampo = this.formulario.get(campo?.hash).value
    if (valorCampo) {
      this.subs.push(this.cadastroGenericoService.getSugestoes(campo?.hash, valorCampo).subscribe({
        next: dados => {
          if (dados.status) {
            if (dados?.lista_sugestoes?.length) {
              this.opcoesPesquisa = dados?.lista_sugestoes
            } else {
              this.toastrService.mostrarToastrWarning('Sem sugestões.')
            }
          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ?? 'Não foi possível carregar as sugestões', 'Dados não encontrados.')
          }
        },
        error: (_err) => {
          this.toastrService.mostrarToastrDanger('Não foi possível carregar as sugestões', 'Dados não encontrados.')
        }
      }))
    }
  }

  validacaoDateRange(event, campo) {
    let campoAlterado = this.dayjs(this.formulario.value[campo?.hash], 'DD/MM/YYYY');
    let campoComparado = this.dayjs(this.formulario.value[campo?.configuracao_geral?.campo_comparativo], 'DD/MM/YYYY');
    let funcaoRange = campo?.configuracao_geral?.funcao_range;

    if (funcaoRange && campoComparado) {
        let isInvalid = 
          (funcaoRange === 'inicio' && campoAlterado.isAfter(campoComparado)) || 
          (funcaoRange !== 'inicio' && campoAlterado.isBefore(campoComparado));

        if (isInvalid) {
          this.formulario.get(campo?.configuracao_geral?.campo_comparativo).setValue('');
        }
    }
}

  preecherValoresCadastroArvore(valores) {
    let jsonCampos = criarCamposCadastroArvore({}, this.campos, this.formBuilder)
    if (valores?.filhos?.length) {
      valores.filhos.forEach(filho => {
        (jsonCampos.get('filhos') as FormArray).push(this.preecherValoresCadastroArvore(filho));
      })
    }
    return jsonCampos
  }

  formFormatado(form: FormGroup): any {
    this.campos?.map(campo => {
      if (campo?.configuracao_geral?.tipo === 'date') {
        if (form[campo?.hash]) {
          form[campo?.hash] = this.dayjs(form[campo?.hash], 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
      }
      if (campo?.configuracao_geral?.tipo === 'planilha') {
        if (form[campo?.hash]) {
          form[campo?.hash] = JSON.parse(form[campo?.hash])
        }
      }
    })
    return form
  }

  verificarConfiguracoesFormulario(): void {
    this.campos?.forEach(campo => {
      let configuracao = campo?.configuracao_geral;
      if (configuracao?.tipo === 'checkbox' && (configuracao?.ocultar || configuracao?.bloquear)) {
        this.changeCheckbox(this.formulario.value[campo?.hash], { configuracao_geral: configuracao, hash: campo?.hash });
      }
    });
  }

  verificarFormularioAlterado(): void {
    const formInicial = this.formulario.value
    this.formulario.valueChanges.subscribe(value => {
      this.isFormAlterado = Object.keys(formInicial).some(key => this.formulario.value[key] != formInicial[key])
    });
  }

  onSubmit(): void {

    this.formulario?.markAllAsTouched()

    // facilicar o debug de erros e envio de dados
    if (!environment.PRODUCTION) {
      console.log(getFormAdminInfos(this.campos, this.formulario));
    }

    if (this.formulario?.valid) {

      let hashAba
      if (this.abas?.length) {
        if (Object.keys(this.abaAtiva)?.length) {
          hashAba = this.abaAtiva['hash']
        } else {
          hashAba = this.abas[0]?.hash
        }
      }

      const form = this.formFormatado(this.formulario?.getRawValue())

      const dados = {
        hash_cadastro: this.hash,
        hash_aba: hashAba,
        pk: this.cadastroId,
        lista_dados: form
      }

      this.cadastroGenericoService.submitDados(dados).subscribe({
        next: (dados) => {
          if (dados.status) {

            this.toastrService.mostrarToastrSuccess('Cadastro realizado com sucesso')

            if (!this.cadastroId && dados?.id)
              this.router.navigate(['admin', this.homeId, 'cadastro', dados?.id])

            this.router.navigate(['admin', this.homeId, 'home'])

          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível salvar os dados do formulário. Submit Error.')
          }
        }, error: (_err) => {
          this.toastrService.mostrarToastrDanger('Não foi possível salvar os dados do formulário. Submit Error.')
        }
      })
    } else {
      this.toastrService.mostrarToastrWarning('Preencha os campos obrigatórios para prosseguir')
    }

  }

  onClose(): void {

    if (this.isFormAlterado) {
      this.modalConfirmacaoService.abrirModalConfirmacao(
        'Formulário alterado',
        'Deseja fechar o formulário? Caso opte por prosseguir, suas alterações serão perdidas e não será possível recuperá-las.',
        {
          icone: 'pi pi-info-circle',
          callbackAceitar: () => {
            this.router.navigate(['admin', this.homeId, 'home']);
          }
        }
      )
    } else {
      this.router.navigate(['admin', this.homeId, 'home']);
    }

  }

  title(texto: string): string {
    return title(texto);
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }

    if (event.shiftKey && event.key === 'Escape') {
      event.preventDefault();
      this.onClose();
    }

    if (event.key === 'F11') {
      if (!this.layoutService.isFullScreen()) {
        this.isFormularioMaximizado.set(true);
      }
    }

  }
}
