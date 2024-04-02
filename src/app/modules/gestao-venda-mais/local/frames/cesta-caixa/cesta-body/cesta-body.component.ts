import { Component, Input } from '@angular/core';
import { ProdutoComponent } from "src/app/shared/components/produto/produto.component";
import { itensCarrinho } from "src/app/shared/models/itensCarrinho.model";

@Component({
  selector: 'app-cesta-body',
  standalone: true,
  imports: [
    ProdutoComponent
  ],
  templateUrl: './cesta-body.component.html',
  styleUrl: './cesta-body.component.css'
})
export class CestaBodyComponent {

  @Input() produtos: Array<itensCarrinho>

}
