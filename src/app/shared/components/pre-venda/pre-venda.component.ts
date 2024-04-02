import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ModalConfirmacaoModule } from './../modal-confirmacao/modal-confirmacao.module';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { CommonModule } from '@angular/common';
import { PesquisaProdutoComponent } from './../pesquisa-produto/pesquisa-produto.component';
import { ProdutoComponent } from 'src/app/shared/components/produto/produto.component';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ElementoFocoDirective } from './../../directives/elemento-foco.directive';
import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { LocalService } from 'src/app/modules/gestao-venda-mais/local/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import * as dayjs from 'dayjs'
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-pre-venda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    TabViewModule,
    FormModule,
    AtalhoEventoDirective,
    ElementoFocoDirective,
    ProdutoComponent,
    PesquisaProdutoComponent,
    AccordionModule,
    SkeletonModule,
    ButtonModule,
    ModalConfirmacaoModule
  ],
  templateUrl: './pre-venda.component.html',
  styleUrl: './pre-venda.component.css'
})
export class PreVendaComponent implements OnInit, OnDestroy {

  @ViewChild('modalPreVenda') modalPreVenda: TemplateRef<any>

  subs: Subscription[] = []

  preVendas: Array<any> = []

  formConsultarPreVenda: FormGroup

  dayjs = dayjs

  activeIndexPreVenda: number | '' = 0

  loadingPreVenda: boolean = false
  preVendaConsultada: boolean = false

  constructor(private localService: LocalService,
              private modalService: ModalService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private modalConfirmacaoService: ModalConfirmacaoService){}

  ngOnInit(): void {

    this.formConsultarPreVenda = this.formBuilder.group({
      cpf: [null],
      codigo: [null]
    })

    this.subs.push(
      this.localService.dadosPreVenda$.subscribe(dados => {
        this.preVendas = []
        if(dados?.pre_vendas?.length){
          this.preVendas = dados?.pre_vendas
        }
        this.visualizarPreVenda()
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

  visualizarPreVenda(): void {
    const botoes = [
      // {
      //   label: 'Confirmar (Shift + Enter)',
      //   color: 'primary',
      //   atalho: 'Enter',
      //   shift: true,
      //   onClick: () => {
      //     this.modalService.fecharModal()
      //   },
      // },
      {
        label: 'Fechar (Shift + Esc)',
        color: 'secondary',
        atalho: 'Escape',
        shift: true,
        onClick: () => {
          this.modalService.fecharModal()
        },
      }
    ]

    this.modalService.abrirModal('Pré-venda', this.modalPreVenda, botoes, {larguraDesktop: 75})
  }

  formatarDataCriacao(dat): string {
    if(!dat)
      return

    const data = this.dayjs(dat, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    const hr = this.dayjs(dat, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')

    return data + ' às ' + hr
  }

  enviarPreVendaParaCesta(ev: PointerEvent|string, preVenda): void {

    if(ev instanceof PointerEvent){
      ev.preventDefault()
      ev.stopPropagation()
    }

    if(!preVenda?.produtos?.length)
      return

    preVenda['pre_venda_utilizada'] = true

    this.localService.atualizarPreVendaSelecionada(preVenda)

    const preVendasNaoUtilizadas = this.preVendas.filter((pre) => {return !pre.pre_venda_utilizada})

    if(!preVendasNaoUtilizadas?.length){
      this.activeIndexPreVenda = ''
    } else {
      this.activeIndexPreVenda = this.preVendas.findIndex((pre) => pre.id == preVendasNaoUtilizadas[0].id)
    }

  }

  panelAtivoAlterado(aba: number): void {
    this.formConsultarPreVenda.reset()
    this.preVendas = []
    this.preVendaConsultada = false
    this.loadingPreVenda = false
  }

  buscarPreVenda(): void {

    const dados = this.formConsultarPreVenda.getRawValue()

    if(!dados?.cpf && !dados?.codigo)
      return

    this.loadingPreVenda = true

    this.localService.buscarPreVendas(dados).subscribe({
      next: (dados) => {
        if(dados?.status){
          if(dados?.pre_vendas?.length){
            this.preVendas = dados?.pre_vendas
          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma pré-venda localizada')
          }
        } else {
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma pré-venda localizada')
        }
        this.preVendaConsultada = true
        setTimeout(() => {
          this.loadingPreVenda = false
        }, 3500);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Nenhuma pré-venda localizada')
        this.preVendaConsultada = true
        this.loadingPreVenda = false
      }
    })
  }

  excluirPreVenda(preVenda): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Excluir pré-venda',
      'Deseja excluir a pré-venda selecionada? Caso prossiga, não será possível recuperá-la.',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          console.log(preVenda);
          this.buscarPreVenda()
        }
      }
    )
  }

  resgatarPreVenda(preVenda): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Resgatar pré-venda',
      'Deseja resgatar a pré-venda selecionada? Caso prossiga, elá estará disponível para consulta.',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          console.log(preVenda);
          this.buscarPreVenda()
        }
      }
    )
  }

}
