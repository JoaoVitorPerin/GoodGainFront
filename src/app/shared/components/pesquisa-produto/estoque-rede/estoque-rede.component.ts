import { LocalService } from 'src/app/modules/gestao-venda-mais/local/local.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estoque-rede',
  standalone: true,
  imports: [
    SkeletonModule
  ],
  templateUrl: './estoque-rede.component.html',
  styleUrl: './estoque-rede.component.css'
})
export class EstoqueRedeComponent {

  @Input() produto: any

  loadingEstoqueRede: boolean = false
  estoqueRede: number = 0

  constructor(private localService: LocalService){}

  buscarEstoqueRede(): void {

    this.loadingEstoqueRede = true

    const dados = {
      cd_produto: this.produto?.produto_id
    }

    this.localService.buscarEstoqueRedeProduto(dados).subscribe({
      next: (dados) => {
        if(dados?.status){
          if(dados?.estoque){
            this.estoqueRede = dados?.estoque
          }
        }
        setTimeout(() => {
          this.loadingEstoqueRede = false
        }, 3500);
      }, error: () => {
        this.loadingEstoqueRede = false
      }
    })



  }

}
