import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { SkeletonModule } from 'primeng/skeleton';
import { LocalService } from 'src/app/modules/gestao-venda-mais/local/local.service';
import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { PanelModule } from 'primeng/panel';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormModule } from "src/app/shared/components/form/form.module";
import { ViaCepService } from "src/app/shared/services/via-cep.service";
import { ToastrService } from "src/app/shared/components/toastr/toastr.service";
import { AtalhoEventoDirective } from "src/app/shared/directives/atalho-evento.directive";
import { ButtonModule } from "primeng/button";
import * as dayjs from 'dayjs'
import { Router } from "@angular/router";

@Component({
  selector: 'app-cliente-cadastrar',
  standalone: true,
  imports: [
    CardModule,
    ReactiveFormsModule,
    CommonModule,
    PanelModule,
    SkeletonModule,
    FormModule,
    AtalhoEventoDirective,
    ButtonModule
  ],
  templateUrl: './cliente-cadastrar.component.html',
  styleUrl: './cliente-cadastrar.component.css'
})
export class ClienteCadastrarComponent implements OnInit {

  dadosNavegacao = window.history?.state?.data

  formCadastrarCliente: FormGroup

  loadingHTMLClub: boolean = false
  htmlClub: string

  cliente: string

  mascaraTipo: 'cpf' | 'cnpj' = 'cpf'

  sexos = [{value: 'f', label: 'Feminino'}, {value: 'm', label: 'Masculino'}, {value: 'o', label: 'Outros'}]

  crs: Array<any> = []
  crUf: Array<any> = []

  enderecoManual: boolean = false

  dayjs = dayjs

  constructor(private formBuilder: FormBuilder,
              private localService: LocalService,
              private sanitizer: DomSanitizer,
              private viaCepService: ViaCepService,
              private toastrService: ToastrService,
              private router: Router,
              private modalConfirmacaoService: ModalConfirmacaoService){}

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
    this.buscarVantagensClub()
    this.buscarCrs()
    this.buscarEstadosCr()
  }

  construirFormularioCliente(): void {
    this.formCadastrarCliente = this.formBuilder.group({
      cliente: [this.cliente, Validators.required],
      nome: [null, Validators.required],
      celular: [null],
      email: [null],
      data_nascimento: [null],
      sexo: [null],
      cr: [null],
      cr_codigo: [null],
      cr_uf: [null],
      cep: [null],
      endereco: [null],
      uf: [null],
      cidade: [null],
      bairro: [null],
      numero: [null],
      complemento: [null],
      termo_cpf_nota: [true],
      termo_uso_privacidade: [true, Validators.requiredTrue],
      termo_uso_club: [true, Validators.requiredTrue],
    })
  }

  buscarVantagensClub(): void {

    this.loadingHTMLClub = true

    this.localService.buscarHTMLVantagensClub().subscribe({
      next: (dados) => {
        if(dados?.status){
          this.htmlClub = dados?.html
          setTimeout(() => {
            this.loadingHTMLClub = false
          }, 3500);
        }
      }
    })
  }

  buscarCrs(): void {
    this.localService.buscarCrs().subscribe({
      next: (dados) => {
        if(dados?.status){
          this.crs = dados?.crs
        }
      }
    })
  }

  buscarEstadosCr(): void {
    this.localService.buscarEstados().subscribe({
      next: (dados) => {
        if(dados?.status){
          this.crUf = []
          if(dados?.estados?.length){
            for(let uf of dados?.estados){
              this.crUf.push({
                value: uf?.id,
                label: uf?.nm_descritivo,
              })
            }
          }
        }
      }
    })
  }

  buscarEndereco(): void {

    const cep = this.formCadastrarCliente?.get('cep')?.value

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
          this.formCadastrarCliente?.get('endereco')?.setValue(dados?.logradouro)
          this.formCadastrarCliente?.get('bairro')?.setValue(dados?.bairro)
          this.formCadastrarCliente?.get('uf')?.setValue(dados?.uf)
          this.formCadastrarCliente?.get('cidade')?.setValue(dados?.localidade)
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

  cadastrarCliente(): void {

    this.formCadastrarCliente?.markAllAsTouched()

    if(this.formCadastrarCliente?.valid){

      const dadosCliente = this.formCadastrarCliente?.getRawValue()

      if(dadosCliente?.data_nascimento)
        dadosCliente.data_nascimento = this.dayjs(dadosCliente?.data_nascimento, 'DD/MM/YYYY').format('YYYY-MM-DD')

      this.localService.cadastrarCliente(dadosCliente).subscribe({
        next: (dados) => {
          if(dados.status){
            const navigationExtras = {
              state: {
                data: {
                  cliente: dadosCliente
                }
              }
            };
            this.router.navigate(['venda-mais', 'local', 'pre-venda', 'produtos'], navigationExtras)
          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível realizar as alterações cadastrais do cliente. Tente novamente e caso persista o erro, contate o Help Desk.')
          }
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Não foi possível realizar as alterações cadastrais do cliente. Tente novamente e caso persista o erro, contate o Help Desk.')
        }
    })
    } else {
      this.toastrService.mostrarToastrDanger('Preencha os campos obrigatórios para prosseguir')
    }
  }

  cancelarCadastro(): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Cancelar cadastro',
      'Deseja cancelar o cadastro atual? Todos os dados serão perdidos',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.router.navigate(['venda-mais', 'local', 'pre-venda', 'cliente']);
        }
      }
    )
  }

  sanitizeString(str: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }

}
