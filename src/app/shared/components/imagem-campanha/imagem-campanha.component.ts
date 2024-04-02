import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-imagem-campanha',
  standalone: true,
  imports: [],
  templateUrl: './imagem-campanha.component.html',
  styleUrl: './imagem-campanha.component.css'
})
export class ImagemCampanhaComponent {

  @Input() urlDesktop: string
  @Input() urlMobile: string

  isMobile: boolean = false

  constructor(){
    if(window.innerWidth < 992){
      this.isMobile = true
    } else {
      this.isMobile = false
    }
  }

}
