import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ModalConfirmacaoModule } from './../../../../../shared/components/modal-confirmacao/modal-confirmacao.module';
import { convertePrecoParaPadraoBR } from 'src/app/core/ts/util';
import { CarrosselProdutosComponent } from './../../../../../shared/components/carrossel-produtos/carrossel-produtos.component';
import { Validators } from '@angular/forms';
import { ViaCepService } from 'src/app/shared/services/via-cep.service';
import { SkeletonModule } from 'primeng/skeleton';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { LocalService } from 'src/app/modules/gestao-venda-mais/local/local.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { PanelModule } from 'primeng/panel';
import * as dayjs from 'dayjs'
import { ToastrService } from "src/app/shared/components/toastr/toastr.service";
import { ButtonModule } from "primeng/button";
import { LabelComponent } from "src/app/shared/components/label/label.component";
import { TableModule } from 'primeng/table';
import { AtalhoEventoDirective } from "src/app/shared/directives/atalho-evento.directive";
import { Router } from "@angular/router";

@Component({
  selector: 'app-cliente-cadastrado',
  standalone: true,
  imports: [
    CardModule,
    ReactiveFormsModule,
    CommonModule,
    FormModule,
    BadgeModule,
    SkeletonModule,
    PanelModule,
    ButtonModule,
    LabelComponent,
    CarrosselProdutosComponent,
    TableModule,
    AtalhoEventoDirective,
    ModalConfirmacaoModule
  ],
  templateUrl: './cliente-cadastrado.component.html',
  styleUrl: './cliente-cadastrado.component.css'
})
export class ClienteCadastradoComponent implements OnInit {

  dadosNavegacao = window.history?.state?.data

  formClienteCadastrado: FormGroup
  formEnderecoCadastrado: FormGroup

  cliente: string
  clienteDadosExtras: any
  clienteDadosEndereco: any

  mascaraTipo: 'cpf' | 'cnpj' = 'cpf'

  sexos = [{value: 'f', label: 'Feminino'}, {value: 'm', label: 'Masculino'}, {value: 'o', label: 'Outros'}]

  scoreCliente: any

  loadingDadosCliente: boolean = false
  loadingDadosScore: boolean = false
  loadingDadosExtraCliente: boolean = false
  loadingDadosEndereco: boolean = false
  loadingDadosParcerias: boolean = false
  loadingDadosConvenios: boolean = false
  loadingDadosComponentes: boolean = false
  loadingDadosHistoricoPedidos: boolean = false

  modoEdicaoEndereco: boolean = false
  enderecoManual: boolean = false

  parcerias: Array<any> = []
  convenios: Array<any> = []

  historicoPedidos: Array<any> = []

  dayjs = dayjs

  componenteClub: any = null
  componenteCliente: any = null

  constructor(private formBuilder: FormBuilder,
              private localService: LocalService,
              private toastrService: ToastrService,
              private viaCepService: ViaCepService,
              private modalConfirmacaoService: ModalConfirmacaoService,
              private router: Router){}

  ngOnInit(): void {

    console.log(this.dadosNavegacao);

    if(this.dadosNavegacao?.cliente?.cliente){
      this.cliente = this.dadosNavegacao?.cliente?.cliente
      if(this.cliente?.replace(/[.\_/\-]/g, '')?.length <= 11){
        this.mascaraTipo = 'cpf'
      } else {
        this.mascaraTipo = 'cnpj'
      }
    }

    this.construirFormularioCliente()
    this.construirFormularioEndereco()
    this.buscarCliente()
    this.buscarClienteScore()
    this.buscarConvenios()
    this.buscarParcerias()
    this.buscarComponentesClub()
  }

  construirFormularioCliente(): void {
    this.formClienteCadastrado = this.formBuilder.group({
      cliente: [this.cliente],
      nome: [null],
      celular: [null],
      email: [null],
      data_nascimento: [null],
      sexo: [null],
      cr: [null],
      cr_codigo: [null],
      cr_uf: [null],
      termo_cpf_nota: [true],
      termo_uso_privacidade: [true],
      termo_uso_club: [true],
    })
  }

  construirFormularioEndereco(): void {
    this.formEnderecoCadastrado = this.formBuilder.group({
      cep: [null, Validators.required],
      endereco: [null, Validators.required],
      uf: [null, Validators.required],
      cidade: [null, Validators.required],
      numero: [null, Validators.required],
      bairro: [null, Validators.required],
      complemento: [null, Validators.required],
    })
  }

  buscarCliente(): void {

    if(!this.cliente)
      return

    const dados = {
      cliente: this.cliente,
      cpf: this.cliente
    }

    this.loadingDadosCliente = true

    this.localService.buscarCliente(dados).subscribe({
      next: (dados) => {
        if(dados?.status){
          if(dados?.data?.cliente?.nm_completo)
            this.formClienteCadastrado?.get('nome')?.setValue(dados?.data?.cliente?.nm_completo)
        }
        this.loadingDadosCliente = false
      }, error: () => {
        this.loadingDadosCliente = false
      }
    })

  }

  buscarClienteScore(): void {

    this.loadingDadosScore = true

    const dados = {
      cliente: this.cliente,
      cpf: this.cliente
    }

    this.localService.buscarClienteScore(dados).subscribe({
      next: (dados) => {
        if(dados?.status){

          this.scoreCliente = {
            value: dados?.score,
            label: dados?.nivel,
            color: dados?.cor
          }

          setTimeout(() => {
            this.loadingDadosScore = false
          }, 2500);
        }
      }
    })
  }

  buscarConvenios(): void {

    this.loadingDadosConvenios = true

    const dados = {
      cliente: this.cliente,
      cpf: this.cliente
    }

    this.localService.buscarConvenios(dados).subscribe({
      next: (dados) => {
        setTimeout(() => {
          if(dados?.status){
            this.convenios = []
            if(dados?.convenios?.length){
              for(const convenio of dados.convenios){
                this.convenios.push({
                  value: convenio?.id,
                  label: convenio?.clube_nome
                })
              }
            }
          }
          this.loadingDadosConvenios = false
        }, 2500);
      }, error: () => {
        this.loadingDadosConvenios = false
      }
    })
  }

  buscarParcerias(): void {

    this.loadingDadosParcerias = true

    const dados = {
      cliente: this.cliente,
      cpf: this.cliente
    }

    this.localService.buscarParcerias(dados).subscribe({
      next: (dados) => {
        setTimeout(() => {
          if(dados?.status){
            this.parcerias = []
            if(dados?.parcerias?.length){
              for(const parcerias of dados.parcerias){
                this.parcerias.push({
                  value: parcerias?.pk,
                  label: parcerias?.clube_nome
                })
              }
            }
          }
          this.loadingDadosParcerias = false
        }, 2500);
      }, error: () => {
        this.loadingDadosParcerias = false
      }
    })
  }

  consultarDadosOnlineCliente(ev): void {

    if(!ev && !this._clienteCarregado){

      this.loadingDadosExtraCliente = true

      const dados = {
        cliente: this.cliente,
        cpf: this.cliente
      }

      this.localService.buscarDadosOnlineCliente(dados).subscribe({
        next: (dados) => {

          setTimeout(() => {

            if(dados?.status){

              this.clienteDadosExtras = {
                celular: dados?.cliente?.celular,
                email: dados?.cliente?.email,
                dat_nasc: dados?.cliente?.dat_nasc,
                sexo: dados?.cliente?.sexo,
              }

              this.formClienteCadastrado?.get('celular')?.setValue(this.clienteDadosExtras?.celular)
              this.formClienteCadastrado?.get('email')?.setValue(this.clienteDadosExtras?.email)

              if(this.clienteDadosExtras?.dat_nasc)
              this.formClienteCadastrado?.get('data_nascimento')?.setValue(this.dayjs(this.clienteDadosExtras?.dat_nasc, 'YYYY-MM-DD').format('DD/MM/YYYY'))

              if(this.clienteDadosExtras?.sexo){
                const sexo = this.sexos.find((s) => {return s?.value == this.clienteDadosExtras?.sexo})
                if(sexo?.label)
                  this.formClienteCadastrado?.get('sexo')?.setValue(sexo?.label)
              }
            }

            this.loadingDadosExtraCliente = false
          }, 2500);
        }, error: () => {
          this.loadingDadosExtraCliente = false
        }
      })
    }
  }

  consultarDadosOnlineEndereco(ev): void {
    if(!ev && !this._enderecoCarregado){

      this.loadingDadosEndereco = true

      const dados = {
        cliente: this.cliente,
        cpf: this.cliente
      }

      this.localService.buscarEnderecoPrincipal(dados).subscribe({
        next: (dados) => {
          setTimeout(() => {

            this.clienteDadosEndereco = {
              ...dados?.endereco
            }

            this.formEnderecoCadastrado?.get('cep')?.setValue(dados?.endereco?.cep__cep_form)
            this.formEnderecoCadastrado?.get('endereco')?.setValue(dados?.endereco?.endereco)
            this.formEnderecoCadastrado?.get('bairro')?.setValue(dados?.endereco?.bairro)
            this.formEnderecoCadastrado?.get('uf')?.setValue(dados?.endereco?.cep__municipio__uf__nm_abrev)
            this.formEnderecoCadastrado?.get('cidade')?.setValue(dados?.endereco?.cep__municipio__nome)
            this.formEnderecoCadastrado?.get('numero')?.setValue(dados?.endereco?.numero)
            this.formEnderecoCadastrado?.get('complemento')?.setValue(dados?.endereco?.complemento)

            this.loadingDadosEndereco = false

          }, 2500);
        }, error: () => {
          this.loadingDadosEndereco = false
        }
      })

    }
  }

  buscarEndereco(): void {

    const cep = this.formEnderecoCadastrado?.get('cep')?.value

    if(!cep)
      return

    if(cep?.replace(/[.\_/\-]/g, '')?.length < 8){
      this.toastrService.mostrarToastrDanger('O CEP informado é inválido')
      return
    }

    this.enderecoManual = false

    this.viaCepService.buscarEndereco(cep).subscribe({
      next: (dados) => {
        if(dados && Object.keys(dados)?.length){
          this.formEnderecoCadastrado?.get('endereco')?.setValue(dados?.logradouro)
          this.formEnderecoCadastrado?.get('bairro')?.setValue(dados?.bairro)
          this.formEnderecoCadastrado?.get('uf')?.setValue(dados?.uf)
          this.formEnderecoCadastrado?.get('cidade')?.setValue(dados?.localidade)
        } else {
          this.enderecoManual = true
          this.toastrService.mostrarToastrDanger('Não foi possível buscar os dados do CEP informado. Preencha o formulário manualmente')
        }
      }, error: () => {
        this.enderecoManual = true
        this.toastrService.mostrarToastrDanger('Não foi possível buscar os dados do CEP informado. Preencha o formulário manualmente')
      }
    })
  }

  habilitarEdicaoEndero(): void {
    this.modoEdicaoEndereco = true
  }

  SalvarEndereco(): void {
    this.formEnderecoCadastrado.markAllAsTouched()

    if(this.formEnderecoCadastrado.valid){

      const dados = this.formEnderecoCadastrado?.getRawValue()

      this.localService.salvarEnderecoPrincipal(dados).subscribe({
        next: (dados) => {
          if(dados?.status){
            this.toastrService.mostrarToastrSuccess('Endereço alterado com sucesso')
            this.modoEdicaoEndereco = false
          } else {
            this.toastrService.mostrarToastrDanger('Não foi possível realizar as alterações no endereço do cliente. Tente novamente e caso persista o erro, contate o Help Desk.')
          }
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Não foi possível realizar as alterações no endereço do cliente. Tente novamente e caso persista o erro, contate o Help Desk.')
        }
      })

    } else {
      this.toastrService.mostrarToastrDanger('Preencha os campos obrigatórios para prosseguir')
    }
  }

  buscarComponentesClub(): void {

    this.loadingDadosComponentes = true

    this.localService.buscarComponentesClub().subscribe({
      next: (dados) => {

        if(dados?.status){
          if(dados?.componente_club && Object.keys(dados?.componente_club)?.length)
            this.componenteClub = dados?.componente_club
          if(dados?.componente_cliente && Object.keys(dados?.componente_cliente)?.length)
            this.componenteCliente = dados?.componente_cliente
        }

        setTimeout(() => {
          this.loadingDadosComponentes = false
        }, 3500);

      }, error: () => {
        this.loadingDadosComponentes = false
      }
    })
  }

  imprimirFilipeta(): void {
    // TODO: Implementar mesma lógica do venda mais produção para impressão da filipeta
  }

  buscarHistoricoPedidos(): void {

    this.loadingDadosHistoricoPedidos = true

    const dados = {
      cliente: this.cliente,
      cpf: this.cliente
    }

    this.localService.buscarHistoricoPedido(dados).subscribe({
      next: (dados) => {
        if(dados?.status){
          if(dados?.pedidos?.length){
            this.historicoPedidos = dados?.pedidos
          } else {
            this.toastrService.mostrarToastrDanger('O cliente não possui nenhum pedido recente')
          }
        } else {
          this.toastrService.mostrarToastrDanger('O cliente não possui nenhum pedido recente')
        }
        setTimeout(() => {
          this.loadingDadosHistoricoPedidos = false
        }, 3500);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('O cliente não possui nenhum pedido recente')
      }
    })

  }

  proximoPasso(): void {
    const navigationExtras = {
      state: {
        data: {
          cliente: this.dadosNavegacao
        }
      }
    };
    this.router.navigate(['venda-mais', 'local', 'pre-venda', 'produtos'], navigationExtras)
  }

  cancelarCadastro(): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Cancelar compra',
      'Deseja cancelar a compra atual? Todos os dados serão perdidos',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.router.navigate(['venda-mais', 'local', 'pre-venda', 'cliente']);
        }
      }
    )
  }

  get _clienteCarregado(): boolean {
    if(this.clienteDadosExtras && Object.keys(this.clienteDadosExtras)?.length)
      return true
    return false
  }

  get _enderecoCarregado(): boolean {
    if(this.clienteDadosEndereco && Object.keys(this.clienteDadosEndereco)?.length)
      return true
    return false
  }

  get _componenteClienteCarregado(): boolean {
    if(this.componenteCliente && Object.keys(this.componenteCliente)?.length)
      return true
    return false
  }

  get _componenteClubCarregado(): boolean {
    if(this.componenteClub && Object.keys(this.componenteClub)?.length)
      return true
    return false
  }

  convertePrecoParaPadraoBR(preco: string | number): void {
    return convertePrecoParaPadraoBR(preco)
  }

}
