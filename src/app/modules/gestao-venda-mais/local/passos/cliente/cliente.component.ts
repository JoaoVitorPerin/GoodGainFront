import { ImagemCampanhaComponent } from './../../../../../shared/components/imagem-campanha/imagem-campanha.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LocalService } from './../../local.service';
import { CarrosselProdutosComponent } from './../../../../../shared/components/carrossel-produtos/carrossel-produtos.component';
import { AtalhoEventoDirective } from './../../../../../shared/directives/atalho-evento.directive';
import { ElementoFocoDirective } from './../../../../../shared/directives/elemento-foco.directive';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormModule } from "src/app/shared/components/form/form.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrService } from "src/app/shared/components/toastr/toastr.service";
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    ElementoFocoDirective,
    AtalhoEventoDirective,
    CarrosselProdutosComponent,
    ImagemCampanhaComponent
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit, OnDestroy {

  formCliente: FormGroup;

  clienteInformado: boolean = false;
  clientePossuiRegistro: boolean = false;
  clientePossuiOptinCpfNota: boolean = false;
  clienteAnonimizado: boolean = false;
  clienteAnonimizadoComCpfNota: boolean = false;

  alterarCpfNota: boolean = false;

  tipo: string;

  tipoCarrossel: string

  componentes: Array<any> = []

  dayjs = dayjs

  preVendas: any = {}
  preVendasEnviadasParaCesta: Array<any> = []

  subs: Subscription[] = []

  mascaraTipo: string = 'cpf'

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastrService: ToastrService,
              private localService: LocalService,
              private el: ElementRef,
              private renderer: Renderer2){}

  ngOnInit(): void {

    this.tipo = this.router.url.split('/')[3]

    this.preVendas = {}

    this.formCliente = this.formBuilder.group({
      cliente: [null, Validators.required],
      cpf: [null],
      cnpj: [null],
      cpf_nota: [null],
      nome: [null],
      data_nascimento: [null],
      celular: [null],
      optin_cpf_nota: [null]
    })

    this.tipoCarrossel = 'produtos'

    this.buscarComponentes()

    this.subs.push(
      this.localService.preVendaSelecionada$.subscribe(dados => {
        if(!this.preVendasEnviadasParaCesta.some((pre) => pre.id == dados.id)){
          this.preVendasEnviadasParaCesta.push(dados)
        }
      })
    )

  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const subs of this.subs){
        subs.unsubscribe()
      }
    }
  }

  buscarComponentes(): void {
    this.localService.buscarComponentes().subscribe({
      next: (dados) => {
        if(dados?.status){
          if(dados?.componentes?.length){
            this.componentes = dados?.componentes
          }
        }
      }
    })
  }

  submitFormulario(): void {

    this.formCliente.markAllAsTouched()

    if(this.formCliente.valid){

      if(!this.clienteInformado && !this.clienteAnonimizadoComCpfNota){

        this.preVendas = {}

        // TODO: Ativar validação de CPF/CNPJ ao iniciar testes
        // if(!validarCPF(this.formCliente?.get('cliente')?.value)){
        //   this.toastrService.mostrarToastrDanger('O CPF informado é inválido')
        //   return
        // }

        const dados = {
          cliente: this.formCliente?.get('cliente')?.value,
          cpf: this.formCliente?.get('cliente')?.value
        }

        this.localService.buscarCliente(dados).subscribe({
          next: (dados) => {

            this.clienteInformado = true;

            if(dados?.status){

              const cliente = dados?.data?.cliente

              this.preVendas = {
                "cliente": "094.637.669-79",
                "pre_vendas": [
                  {
                    "id": 54,
                    "codigo": 37,
                    "dat_criacao": "2024-02-26 18:15:20",
                    "produtos":[{
                      "produto_id": "12345",
                      "nm_produto": "Coca Cola | Teste",
                      "nm_marca": "Colgate",
                      "eans": [
                          "7894900700015",
                          "2321321"
                      ],
                      "imagem": "https://w7.pngwing.com/pngs/840/560/png-transparent-santa-claus-coca-cola-fizzy-drinks-christmas-coca-cola-vintage-fictional-character-cola-haddon-sundblom.png",
                      "descricao": null,
                      "preco": {
                        "vlr_ini": 5.65,
                        "vlr_fim": 4.50
                      },
                      "quantidade": 3
                    }]
                  },
                  {
                    "id": 55,
                    "codigo": 38,
                    "dat_criacao": "2024-02-27 09:20:20",
                    "produtos":[{
                      "produto_id": "12345",
                      "nm_produto": "Coca Cola | Teste",
                      "nm_marca": "Colgate",
                      "eans": [
                          "7894900700015",
                          "2321321"
                      ],
                      "imagem": "https://w7.pngwing.com/pngs/840/560/png-transparent-santa-claus-coca-cola-fizzy-drinks-christmas-coca-cola-vintage-fictional-character-cola-haddon-sundblom.png",
                      "descricao": null,
                      "preco": {
                        "vlr_ini": 5.65,
                        "vlr_fim": 4.50
                      },
                      "quantidade": 5
                    }]
                  }
                ]
              }

              this.clientePossuiRegistro = cliente ? true : false
              this.clientePossuiOptinCpfNota = cliente?.is_cpf_nota ? true : false

              if(cliente){
                this.formCliente?.get('nome').setValue(cliente?.nm_completo)
                this.formCliente?.get('celular').setValue(cliente?.celular)
                if(cliente?.dat_nasc)
                  this.formCliente?.get('dat_nasc').setValue(this.dayjs(cliente?.dat_nasc, 'YYYY-MM-DD').format('DD/MM/YYYY'))
              }

            } else {
              this.clientePossuiRegistro = false;
              this.clientePossuiOptinCpfNota = false
              this.alterarCpfNota = true
            }

            if(this.clientePossuiOptinCpfNota){
              this.formCliente?.get('optin_cpf_nota')?.setValue(true)
            } else {
              this.alterarCpfNota = true
              this.formCliente?.get('cpf_nota')?.setValue(this.formCliente?.get('cliente')?.value)
            }

            if(this.tipo === 'pre-venda'){
              this.proximoPasso()
            } else {
              if(this.clientePossuiRegistro && this.clientePossuiOptinCpfNota && !Object.keys(this.preVendas)?.length)
                this.proximoPasso()
            }

          }, error: () => {

            this.clienteInformado = true;
            this.clientePossuiRegistro = false;
            this.clientePossuiOptinCpfNota = false
            this.alterarCpfNota = true
            this.formCliente?.get('cpf_nota')?.setValue(this.formCliente?.get('cliente')?.value)

            if(this.tipo === 'pre-venda')
              this.proximoPasso()
          }
        })

      } else {
        this.proximoPasso()
      }

    } else {
      this.toastrService.mostrarToastrDanger('Preencha os campos para prosseguir')
    }
  }

  clienteAnonimo(): void {
    this.clienteAnonimizado = true;
    this.proximoPasso()
  }

  clienteAnonimoComCpfNota(): void {
    this.clienteAnonimizadoComCpfNota = true
    this.alterarCpfNota = true
    this.formCliente?.get('cliente')?.clearValidators()
    this.formCliente?.get('cliente')?.updateValueAndValidity()
  }

  reativarProcessoCadastro(): void {
    this.clienteAnonimizadoComCpfNota = false
    this.alterarCpfNota = false
    this.formCliente?.get('cliente')?.addValidators([Validators.required])
    this.formCliente?.get('cliente')?.updateValueAndValidity()
  }

  notaCpfAlterado(): void {
    this.alterarCpfNota = !this.alterarCpfNota
    if(this.alterarCpfNota){
      this.formCliente?.get('cpf_nota')?.addValidators([Validators.required])
      this.formCliente?.get('cpf_nota')?.setValue(this.formCliente?.get('cliente')?.value)
      if(this.formCliente?.get('optin_cpf_nota')?.value)
        this.formCliente?.get('optin_cpf_nota')?.setValue(false)
    } else {
      this.formCliente?.get('cpf_nota')?.clearValidators()
    }
    this.formCliente?.get('cpf_nota')?.updateValueAndValidity()
  }

  optionCpfNotaAlterado(ev): void {
    if(ev){
      if(this.alterarCpfNota){
        this.formCliente?.get('cpf_nota')?.setValue(this.formCliente?.get('cliente').value)
        this.alterarCpfNota = false
      }
    }
  }

  visualizarPreVendas(): void {
    this.localService.atualizarDadosPreVenda(this.preVendas)
  }

  cadastrarCliente(): void {

    const dadosCliente = this.gerarDadosPassoCliente()

    const jsonEnvio = {
      cpf: dadosCliente?.cliente,
      nome: dadosCliente?.nome,
      celular: dadosCliente?.celular,
      dat_nasc: dadosCliente?.data_nascimento ? this.dayjs(dadosCliente?.data_nascimento, 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
      is_cpf_nota: dadosCliente?.optin_cpf_nota
    }

    this.localService.cadastrarCliente(jsonEnvio).subscribe({
      next: (dados) => {
        if(dados.status){

          const navigationExtras = {
            state: {
              data: dadosCliente
            }
          };

          this.router.navigate(['venda-mais', 'local', this.tipo, 'produtos'], navigationExtras)

        } else {
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível realizar as alterações cadastrais do cliente. Tente novamente e caso persista o erro, contate o Help Desk.')
        }
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Não foi possível realizar as alterações cadastrais do cliente. Tente novamente e caso persista o erro, contate o Help Desk.')
      }
    })
  }

  gerarDadosPassoCliente(): any {

    const dados = this.formCliente.getRawValue()

    if(this.clientePossuiOptinCpfNota || dados['optin_cpf_nota'])
      dados['cpf_nota'] = dados['cliente']

    if(this.clienteAnonimizado || this.clienteAnonimizadoComCpfNota)
      dados['cliente'] = '0'

    if(this.clienteAnonimizado && !this.alterarCpfNota)
      dados['cpf_nota'] = '0'

    return {
      cliente: dados,
      cliente_anonimo: this.clienteAnonimizado || this.clienteAnonimizadoComCpfNota,
      pre_vendas: this.preVendasEnviadasParaCesta
    }
  }

  proximoPasso(): void {

    const navigationExtras = {
      state: {
        data: this.gerarDadosPassoCliente()
      }
    };

    if(this.tipo === 'pre-venda'){

      if(this.clienteAnonimizado || this.clienteAnonimizadoComCpfNota){
        this.router.navigate(['venda-mais', 'local', this.tipo, 'produtos'], navigationExtras)
      } else {
        /*
        * Caso o seja pré-venda, encaminha para o próximo step conforme o cliente já seja cadastrado ou não
        */
        if(this.clientePossuiRegistro){
          this.router.navigate(['venda-mais', 'local', this.tipo, 'cliente-cadastrado'], navigationExtras)
        } else {
          this.router.navigate(['venda-mais', 'local', this.tipo, 'cliente-cadastrar'], navigationExtras)
        }
      }
    } else {
      if(this.clientePossuiRegistro && this.clientePossuiOptinCpfNota){
        /*
        * Cliente já possui cadastro e possui também a flag de reutilização do seu CPF na nota
        */
        this.router.navigate(['venda-mais', 'local', this.tipo, 'produtos'], navigationExtras)
      } else if(this.clientePossuiRegistro && !this.clientePossuiOptinCpfNota){
        if(!this.formCliente?.get('optin_cpf_nota')?.value){
          /*
          * Cliente possui cadastro, não possui a flag de reutilização do seu CPF na nota e não mudou essa decisão
          */
          this.router.navigate(['venda-mais', 'local', this.tipo, 'produtos'], navigationExtras)
        } else {
          /*
          * Cliente possui cadastro, não possui a flag de reutilização do seu CPF na nota mas alterou a flag para true. Neste caso é chamado o cadastro pois deve ser alterado a flag em nossa base
          */
          this.cadastrarCliente()
        }
      } else if (this.clienteAnonimizado || this.clienteAnonimizadoComCpfNota) {
        /*
        * Cliente não quis se identificar, optando por nota com ou sem CPF
        */
        this.router.navigate(['venda-mais', 'local', this.tipo, 'produtos'], navigationExtras)
      } else if(!this.clientePossuiRegistro) {
        /*
        * Cliente não possui cadastro e informou os seus dados no caixa
        */
        this.cadastrarCliente()
      }
    }
  }

  possuiPreVendasDisponiveis(): boolean {
    return Object.keys(this.preVendas)?.length ? true : false
  }

  alternarTipoDeMascaraCliente(ev: KeyboardEvent ): void {

    const valorCliente = this.formCliente?.get(this.mascaraTipo)?.value
    const tamanhoString = this.formCliente?.get(this.mascaraTipo)?.value?.replace(/[.\_/\-]/g, '')?.length
    const tipoMascara = !tamanhoString || tamanhoString <= 11 ? 'cpf' : 'cnpj'
    const ultimoDigito = ev?.key
    const isDigito = /^(?:[1-9]\d*|0)?$/

    if(this.mascaraTipo != tipoMascara){

      this.mascaraTipo = tipoMascara
      this.formCliente?.get(this.mascaraTipo)?.setValue(valorCliente + (tipoMascara === 'cnpj' && isDigito.test(ultimoDigito) ? ultimoDigito : ''))

      setTimeout(() => {
        const focusEl = this.el.nativeElement.ownerDocument.getElementById(tipoMascara)?.querySelector('input');
        this.renderer.selectRootElement(focusEl).focus();
      }, 50);

    }
  }

  validarDocumento(): void {
    //TODO: Adicionar validação de cpf/cnpj antes de setar valor no campo cliente
    const clienteDocumentoValor = this.formCliente?.get(this.mascaraTipo)?.value
    this.formCliente?.get('cliente')?.setValue(clienteDocumentoValor)
  }

}
