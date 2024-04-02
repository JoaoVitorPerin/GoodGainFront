import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { Subscription } from 'rxjs';
import { ModalService } from './../../../../../../shared/components/modal/modal.service';
import { LocalService } from './../../../local.service';
import { ModalConfirmacaoService } from './../../../../../../shared/components/modal-confirmacao/modal-confirmacao.service';
import { Component, Input, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { convertePrecoParaPadraoBR, } from "src/app/core/ts/util";
import { itensCarrinho } from "src/app/shared/models/itensCarrinho.model";
import { ButtonModule } from "primeng/button";
import { Router } from "@angular/router";

@Component({
  selector: 'app-cesta-footer',
  standalone: true,
  imports: [
    ButtonModule,
    AtalhoEventoDirective
  ],
  templateUrl: './cesta-footer.component.html',
  styleUrl: './cesta-footer.component.css'
})
export class CestaFooterComponent implements OnInit, OnDestroy {

  @ViewChild('modalAutorizacaoGestor') modalAutorizacaoGestor: TemplateRef<any>

  @Input() produtos: Array<itensCarrinho>
  @Input() passo: string

  modoExclusao: boolean = false;

  subs: Subscription[] = []

  get _textoBotaoPrincipal(): string {
    if(!this.passo || this.passo == 'produtos'){
      if(this.tipo === 'pre-venda'){
        return 'Finalizar pré-venda'
      } else {
        return 'Realizar pagamento (Enter)'
      }
    } else if(this.passo == 'pagamento'){
      return 'Finalizar compra (Enter)'
    }
  }

  valorRestante: number = 0

  tipo: string

  constructor(private router: Router,
              private modalConfirmacaoService: ModalConfirmacaoService,
              private localService: LocalService,
              private modalService: ModalService){}

  ngOnInit(): void {

    this.tipo = this.router.url.split('/')[3]

    this.subs.push(
      this.localService.toggleModoExclusao$.subscribe(decisao => {
        this.modoExclusao = decisao
      })
    )
    this.subs.push(
      this.localService.decisaoModoExclusao$.subscribe(() => {
        this.modoExclusao = false
      })
    )
    this.subs.push(
      this.localService.valorRestante$.subscribe(valor => {
        this.valorRestante = +valor.toFixed(2)
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

  calculaValortotal(): string {
    let valorTotal = 0

    if(this.produtos?.length){
      for(const produto of this.produtos){
        if(produto?.preco && produto?.preco['vlr_fim']){
          valorTotal += produto?.preco['vlr_fim'] * (produto?.quantidade ? +produto?.quantidade : 1)
        }
      }
    }

    return this.convertePrecoParaPadraoBR(valorTotal)
  }

  calcularDesconto(): string {

    let valorDesconto = 0

    if(this.produtos?.length){
      for(const produto of this.produtos){
        if(produto?.preco && produto?.preco['vlr_ini'] && produto?.preco['vlr_fim']){
          valorDesconto += (+produto?.preco['vlr_ini'] - +produto?.preco['vlr_fim']) * (produto?.quantidade ? +produto?.quantidade : 1)
        }
      }
    }

    return this.convertePrecoParaPadraoBR(valorDesconto)
  }

  convertePrecoParaPadraoBR(preco: string | number): string {
    return convertePrecoParaPadraoBR(preco)
  }

  proximoPasso(): void {
    this.localService.atualizarProximoPasso(true)
  }

  cancelarCompra(): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Cancelar compra',
      'Deseja cancelar a compra atual? Todos os dados serão perdidos',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.router.navigate(['venda-mais', 'local', 'caixa', 'cliente']);
        }
      }
    )
  }

  cancelarExclusao(): void {
    this.localService.atualizarToggleModoExclusao(false)
    this.localService.atualizarDecisaoModoExclusao(false)
  }

  autorizarModoExclusao(): void {
    const botoes = [
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
    this.modalService.abrirModal('Autorizar exclusão da cesta', this.modalAutorizacaoGestor, botoes, {larguraDesktop: '40'})
  }

  habilitarModoExclusao(): void {
    this.modalService.fecharModal()
    this.localService.atualizarToggleModoExclusao(true)
  }

  confirmarExclusao(): void {
    this.localService.atualizarDecisaoModoExclusao(true)
  }

}
