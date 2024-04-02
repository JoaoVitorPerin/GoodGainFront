import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VisualizarProdutoService {

  /*
  ** Subject que irá atualizar o valor restante a ser pago que será exibido na cesta
  */
  private visualizarProduto = new Subject<any>();
  visualizarProduto$ = this.visualizarProduto.asObservable();

  constructor() { }

  atualizarVisualizarProduto(produto) {
    this.visualizarProduto.next(produto)
  }
}
