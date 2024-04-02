import { CommonModule } from '@angular/common';
import { VisualizarProdutoService } from './../visualizar-produto/visualizar-produto.service';
import { VisualizarProdutoComponent } from './../visualizar-produto/visualizar-produto.component';
import { LocalService } from './../../../modules/gestao-venda-mais/local/local.service';
import { Subscription } from 'rxjs';
import { PrecoComponent } from './../preco/preco.component';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { itensCarrinho } from "../../models/itensCarrinho.model";
import { DividerModule } from "primeng/divider";

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [
    CommonModule,
    PrecoComponent,
    DividerModule,
    VisualizarProdutoComponent
  ],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css'
})
export class ProdutoComponent implements OnInit, OnDestroy {

  @Input() produto: itensCarrinho
  @Input() tamanho: string

  modoExclusao: boolean = false;

  subs: Subscription[] = []

  get _imgTamanho(): number {
    switch(this.tamanho){
      case 'xs':
        return 30;
      case 'sm':
        return 40;
      case 'md':
        return 65;
      case 'lg':
        return 80;
      case 'xl':
        return 100;
      default:
        return 50;
    }
  }

  constructor(private localService: LocalService,
              private visualizarProdutoService: VisualizarProdutoService){}

  ngOnInit(): void {
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
  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

  calcularQuantidade(): number {

    if(!this.modoExclusao)
      return +this.produto?.quantidade

    return +this.produto?.quantidade - (this.produto?.quantidade_removida ? +this.produto?.quantidade_removida : 0)
  }

  visualizarProduto(): void {
    this.visualizarProdutoService.atualizarVisualizarProduto(this.produto)
  }

}
