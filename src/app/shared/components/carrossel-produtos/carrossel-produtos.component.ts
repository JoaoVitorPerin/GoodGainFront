import { PrecoComponent } from './../preco/preco.component';
import { Component, Input, OnInit } from '@angular/core';
import { CarouselModule } from "primeng/carousel";

@Component({
  selector: 'app-carrossel-produtos',
  standalone: true,
  imports: [
    CarouselModule,
    PrecoComponent
  ],
  templateUrl: './carrossel-produtos.component.html',
  styleUrl: './carrossel-produtos.component.css'
})
export class CarrosselProdutosComponent {

  @Input({required: true}) produtos: Array<any>
  @Input() qtd_mobile: number
  @Input() qtd_desktop: number
  @Input() border: string
  @Input() showNavigators: boolean
  @Input() showIndicators: boolean
  @Input() imgHeight: number
  @Input() imgWidth: number
  @Input() precoTamanho: string
  @Input() removerVlrIni: boolean
  @Input() precoAltura: number

  isMobile: boolean = false

  constructor(){
    if(window.innerWidth < 992){
      this.isMobile = true
    } else {
      this.isMobile = false
    }
  }

}
