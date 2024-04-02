import { ElementoFocoDirective } from './../../../../../shared/directives/elemento-foco.directive';
import { ModalConfirmacaoModule } from './../../../../../shared/components/modal-confirmacao/modal-confirmacao.module';
import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { NoFormModule } from './../../../../../shared/components/no-form/no-form.module';
import { ButtonModule } from 'primeng/button';
import { ModalService } from './../../../../../shared/components/modal/modal.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './../../../../../shared/components/label/label.component';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { LocalService } from './../../local.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormArray, Validators, FormsModule, FormControl } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ToastrService } from './../../../../../shared/components/toastr/toastr.service';
import { LabelButtonComponent } from './../../../../../shared/components/label-button/label-button.component';
import { CestaComponent } from './../../frames/cesta-caixa/cesta.component';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from "rxjs";
import { itensCarrinho } from "src/app/shared/models/itensCarrinho.model";
import { convertePrecoParaPadraoBR } from "src/app/core/ts/util";
import { ModalModule } from "src/app/shared/components/modal/modal.module";
import { AccordionModule } from 'primeng/accordion';
import { ModalConfirmacaoService } from "src/app/shared/components/modal-confirmacao/modal-confirmacao.service";
import { FieldsetModule } from 'primeng/fieldset';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    CestaComponent,
    LabelButtonComponent,
    DividerModule,
    ReactiveFormsModule,
    FormModule,
    LabelComponent,
    InputNumberModule,
    ModalModule,
    ButtonModule,
    NoFormModule,
    AtalhoEventoDirective,
    ModalConfirmacaoModule,
    ElementoFocoDirective,
    AccordionModule,
    FieldsetModule,
    SkeletonModule
  ],
  templateUrl: './pagamento.component.html',
  styleUrl: './pagamento.component.css'
})
export class PagamentoComponent implements OnInit, OnDestroy {

  @ViewChild('modalResumoCompra') modalResumoCompra: TemplateRef<any>

  produtos: Array<itensCarrinho> | [] = [];

  valorTotal: number = 0;
  valorDesconto: number = 0;

  subs: Subscription[] = []

  dadosNavegacao = window.history?.state?.data

  cupomInvalido: boolean = false

  cupomAplicado: boolean = false;

  possuiCashback: boolean = false;

  cashbackUtilizado: boolean = false;

  saldoCashback: number;

  formPagamento: FormGroup;

  formasPagamento: Array<any> = []

  tipo: string

  activeIndexFormaPagamento: number = 0

  get formArrayPagamento(): FormArray {
    return this.formPagamento?.get('pagamentos') as FormArray;
  }

  validatorsIniciais: { [key: string]: any } = {};

  loadingPagamento: boolean = true

  constructor(private router: Router,
              private toastrService: ToastrService,
              private formBuilder: FormBuilder,
              private localService: LocalService,
              private modalService: ModalService,
              private modalConfirmacaoService: ModalConfirmacaoService,
              private el: ElementRef,
              private renderer: Renderer2){}

  ngOnInit(): void {

    this.tipo = this.router.url?.split('/')[3]

    if(!this.dadosNavegacao)
      this.router.navigate(['venda-mais', 'local', 'caixa', 'cliente'])

    this.produtos = this.dadosNavegacao?.produtos

    if(this.produtos?.length){
      for(const produto of this.produtos){
        if(produto?.preco && produto?.preco?.vlr_fim){
          this.valorTotal += +produto?.preco?.vlr_fim * (produto?.quantidade ? +produto?.quantidade : 1)
        }
        if(produto?.preco && produto?.preco?.vlr_ini && produto?.preco?.vlr_fim){
          this.valorDesconto += (+produto?.preco?.vlr_ini - +produto?.preco?.vlr_fim) * (produto?.quantidade ? +produto?.quantidade : 1)
        }
      }
      this.valorTotal = +this.valorTotal.toFixed(2)
      this.valorDesconto = +this.valorDesconto.toFixed(2)
    }

    this.subs.push(
      this.localService.proximoPasso$.subscribe(() => {
        this.proximoPasso()
      })
    )

    // TODO: Adicionar lógica para buscar cashback
    this.possuiCashback = true
    this.saldoCashback = 100000.50

    this.construiFormularioPagamento()

    this.adicionarFormaPagamento()

    this.buscarFormasPagamento()

  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const subs of this.subs){
        subs.unsubscribe()
      }
    }
  }

  construiFormularioPagamento(): void {

    this.formPagamento = this.formBuilder.group({
      pagamentos: this.formBuilder.array([])
    })

    this.salvarObrigatoriedadePagamento(this.formPagamento)

  }

  buscarFormasPagamento(): void {

    this.loadingPagamento = true

    this.localService.buscarFormasPagamento().subscribe({
      next: (dados) => {

        if(dados?.status){
          if(dados?.data?.length){

            let index = 0

            const formasPagamento = dados?.data?.filter((pag) => this.tipo != 'recarga' ? pag.origem === 'caixa' : pag.origem === 'celular')

            if(formasPagamento?.length){
              for(const pagamento of formasPagamento){
                index += 1
                this.formasPagamento.push({
                  value: pagamento?.chave,
                  label: pagamento?.valor,
                  nm_descritivo: pagamento?.valor,
                  icon: pagamento?.imagem,
                  atalho: index,
                  ctrl: true
                })
              }
            }

          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma forma de pagamento encontrada. Tente novamente e caso persista o erro, contate o Help Desk.')
          }
        } else {
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma forma de pagamento encontrada. Tente novamente e caso persista o erro, contate o Help Desk.')
        }

        this.loadingPagamento = false;

      }, error: () => {
        this.toastrService.mostrarToastrDanger('Nenhuma forma de pagamento encontrada. Tente novamente e caso persista o erro, contate o Help Desk.')
      }
    })
  }

  adicionarFormaPagamento(): void {

    this.formArrayPagamento.push(
      this.formBuilder.group({
        pagamento: [null, Validators.required],
        vlr_pago: [this.formArrayPagamento?.controls?.length === 0 ? this.valorTotal : this.calcularValorRestante(), Validators.required],
        pagamento_efetuado: [null, Validators.required]
      })
    )

    this.salvarObrigatoriedadePagamento(this.formPagamento)

    setTimeout(() => {
      if(this.formArrayPagamento?.controls?.length === 1)
        this.localService.atualizarValorRestante(+this.valorTotal.toFixed(2))
    }, 50);

    this.activeIndexFormaPagamento = this.formArrayPagamento?.controls?.length - 1
  }

  cupomDesconto(ev): void {

    const cupom = ev?.value ?? ev

    if(!cupom){
      this.toastrService.mostrarToastrDanger('Informe um cupom para prosseguir')
      this.cupomInvalido = true
      return
    }

    this.cupomInvalido = false
    this.cupomAplicado = !this.cupomAplicado
  }

  aplicarCashback(): void {
    if(!this.saldoCashback)
      return

    this.cashbackUtilizado = !this.cashbackUtilizado

    if(this.cashbackUtilizado && (+this.saldoCashback >= +this.valorTotal)){
      this.removerObrigatoriedadePagamento(this.formPagamento)
      this.formPagamento.reset()
      if(this.formArrayPagamento?.controls?.length > 1){
        for(const index in this.formArrayPagamento.controls){
          if(index){
            this.formArrayPagamento.removeAt(parseInt(index))
          }
        }
        this.formArrayPagamento.updateValueAndValidity()
      }
    } else {
      this.adicionarObrigatoriedadePagamento(this.formPagamento)
    }
  }

  confirmarPagamento(event, index): void {

    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Pagamento',
      `Deseja confirmar o pagamento de R$ ${this.convertePrecoParaPadraoBR(this.formArrayPagamento?.at(index)?.get('vlr_pago')?.value)} via ${this.formArrayPagamento?.at(index)?.get('pagamento')?.value?.nm_descritivo}?`,
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {

          this.formArrayPagamento?.at(index)?.get('pagamento_efetuado')?.setValue(true)

          let valorTotal = 0
          if(this.formArrayPagamento?.value?.length){
            for(const pagamento of this.formArrayPagamento.value){
              if(+pagamento?.vlr_pago == 0)
                return

              if(!isNaN(+pagamento?.vlr_pago)){
                valorTotal += +pagamento?.vlr_pago.toFixed(2)
              }
            }
          }

          if(+valorTotal.toFixed(2) < +this.valorTotal.toFixed(2)){
            this.adicionarFormaPagamento()
          } else if (+valorTotal.toFixed(2) > +this.valorTotal.toFixed(2)) {
            this.toastrService.mostrarToastrDanger('Valor que já foi pago pelo cliente está divergente do valor restante da cesta')
          } else {
            this.calcularValorRestante()
          }

        }, callbackRejeitar: () => {
          this.formArrayPagamento?.at(index)?.get('pagamento_efetuado')?.setValue(false)
        }
      }
    )
  }

  calcularValorRestante(): number {
    let valorTotalPago = 0
    if(this.formArrayPagamento?.value?.length){
      for(const pagamento of this.formArrayPagamento.value){
        if(+pagamento?.vlr_pago)
        valorTotalPago += +pagamento?.vlr_pago
      }
    }
    if((+this.valorTotal - +valorTotalPago) >= 0){
      this.localService.atualizarValorRestante(+this.valorTotal - +valorTotalPago)
      return +this.valorTotal - +valorTotalPago
    } else {
      this.localService.atualizarValorRestante(0)
      return 0
    }
  }

  focusPagamentoSelecionado(_valor, index): void {
    setTimeout(() => {
      const elementoInputValor = this.el.nativeElement.ownerDocument.getElementById('pagamento' + index)?.querySelector('input')
      if(elementoInputValor)
        this.renderer.selectRootElement(elementoInputValor).focus();
    }, 50);
  }

  verificarIndexPagamentoPendente(): number | '' {
    if(this.formArrayPagamento?.controls?.length){
      for(const control of this.formArrayPagamento.controls){
        if(!(control as FormGroup)?.get('pagamento_efetuado')?.value)
          return this.activeIndexFormaPagamento
      }
    }
    return ''
  }

  proximoPasso(): void {

    this.formPagamento.markAllAsTouched()

    if(this.formPagamento.valid){

      const botoes = [
        {
          label: 'Enviar apenas por e-mail (Alt + 1)',
          color: 'primary',
          atalho: '1',
          alt: true,
          onClick: () => {
            this.modalService.fecharModal()
            this.finalizarCompra()
          }
        },
        {
          label: 'Imprimir nota e enviar por e-mail (Alt + 2)',
          color: 'secondary',
          text: true,
          atalho: '2',
          alt: true,
          size: 'small',
          onClick: () => {
            this.modalService.fecharModal()
            this.imprimirNota()
          }
        }
      ]

      //TODO: flag isFechar deverá ser true ao iniciar homologacao para impedir que a modal seja fechada sem ação
      this.modalService.abrirModal('Resumo da compra', this.modalResumoCompra, botoes, {larguraDesktop: '75', isFechar: true})

    } else {
      this.toastrService.mostrarToastrDanger('Informe a(s) forma(s) de pagamento finalizar a compra')
    }
  }

  finalizarCompra(): void {
    this.modalService.fecharModal()
    this.router.navigate(['venda-mais', 'local', this.tipo, 'cliente'])
  }

  imprimirNota(): void {
    this.modalService.fecharModal()
    this.router.navigate(['venda-mais', 'local', this.tipo, 'cliente'])
  }

  labelFormaPagamento(index): string {
    return `Valor pago (${this.formArrayPagamento?.at(index)?.get('pagamento')?.value?.nm_descritivo}) (Alt + ${index + 1})`
  }

  convertePrecoParaPadraoBR(preco: number | string): string {
    return convertePrecoParaPadraoBR(preco)
  }

  salvarObrigatoriedadePagamento(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.salvarObrigatoriedadePagamento(control);
      } else if (control instanceof FormControl) {
        this.validatorsIniciais[key] = control.validator;
      }
    });
  }

  removerObrigatoriedadePagamento(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.removerObrigatoriedadePagamento(control);
      } else if (control instanceof FormControl) {
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });
  }

  adicionarObrigatoriedadePagamento(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.adicionarObrigatoriedadePagamento(control);
      } else if (control instanceof FormControl) {
        control.setValidators(this.validatorsIniciais[key]);
        control.updateValueAndValidity();
      }
    });
  }

}
