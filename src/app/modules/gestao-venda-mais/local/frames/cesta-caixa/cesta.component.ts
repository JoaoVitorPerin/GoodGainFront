import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LocalService } from './../../local.service';
import { CestaFooterComponent } from './cesta-footer/cesta-footer.component';
import { CestaBodyComponent } from './cesta-body/cesta-body.component';
import { CestaHeaderComponent } from './cesta-header/cesta-header.component';
import { ProdutoComponent } from './../../../../../shared/components/produto/produto.component';
import { itensCarrinho } from 'src/app/shared/models/itensCarrinho.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [
    CommonModule,
    ProdutoComponent,
    CestaHeaderComponent,
    CestaBodyComponent,
    CestaFooterComponent
  ],
  templateUrl: './cesta.component.html',
  styleUrl: './cesta.component.css'
})
export class CestaComponent implements OnInit, OnDestroy {

  @Input() produtos: Array<itensCarrinho>
  @Input() passo: string

  subs: Subscription[] = []

  modoExclusao: boolean = false;

  valorRestante: number = 0

  constructor(private localService: LocalService){}

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

}
