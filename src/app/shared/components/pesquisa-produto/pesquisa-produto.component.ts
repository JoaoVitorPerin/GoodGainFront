import { BotaoPrecoComponent } from './../botao-preco/botao-preco.component';
import { EstoqueRedeComponent } from './estoque-rede/estoque-rede.component';
import { EstoqueLocalComponent } from './estoque-local/estoque-local.component';
import { VisualizarProdutoService } from './../visualizar-produto/visualizar-produto.service';
import { VisualizarProdutoComponent } from './../visualizar-produto/visualizar-produto.component';
import { AtalhoEventoDirective } from './../../directives/atalho-evento.directive';
import { PrecoComponent } from './../preco/preco.component';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-pesquisa-produto',
  standalone: true,
  imports: [
    PrecoComponent,
    AtalhoEventoDirective,
    ButtonModule,
    VisualizarProdutoComponent,
    EstoqueLocalComponent,
    EstoqueRedeComponent,
    BotaoPrecoComponent
  ],
  templateUrl: './pesquisa-produto.component.html',
  styleUrl: './pesquisa-produto.component.css'
})
export class PesquisaProdutoComponent {

  @Input() produtos: Array<any>
  @Input() imgWidth: number
  @Input() imgHeight: number
  @Input() grid: string
  @Input() tamanho: 'xs'|'sm'|'md'|'lg'
  @Input() habilitarAtalho: boolean
  @Input() alt: boolean
  @Input() ctrl: boolean
  @Input() shift: boolean
  @Input() bloquearBotaoAcao: boolean

  @Output() selected = new EventEmitter()

  constructor(private visualizarProdutoService: VisualizarProdutoService){}

  onProdutoSelecionado(produto): void {
    this.selected.emit(produto)
  }

  getLabelBotao(index: number): string {
    let txtBotao = ''
    if(this.ctrl)
      txtBotao = '(Ctrl + '
    if(this.alt)
      txtBotao = '(Alt + '
    if(this.shift)
      txtBotao = '(Shift + '
    txtBotao += index + 1 + ')'
    return txtBotao
  }

  visualizarProduto(produto): void {
    this.visualizarProdutoService.atualizarVisualizarProduto(produto)
  }

}
